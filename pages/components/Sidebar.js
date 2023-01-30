import { Avatar, Button, Icon, IconButton } from "@material-ui/core";
import { Chat, MoreVert, Search } from "@material-ui/icons";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, doc, getDoc, query, where } from "firebase/firestore";
import ChatField from "./ChatField";

function Sidebar() {

  const [user] = useAuthState(auth);



    const userChatRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
    const [chatSnapShot] = useCollection(userChatRef);
    console.log("snap: ")
    // console.log(chatSnapShot)

  const createChat = ()=>{
    const input = window.prompt("Please enter then email address of the user you wish to chat with:"); 
    
    if(!input) return null;

    if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input!=user.email){
        // Here we add the email to db
        const chatRef = addDoc(collection(db, "chats"),{
            users: [user.email, input]
        });
    }

 }

 const chatAlreadyExists = (recipientEmail)=>{
    return (
    // Here double exclamatory returns boolean value for what is returned..
    !!chatSnapShot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)
    )
 };

  return (
    <Container>
        <Header>
            <UserAvatar onClick={()=>auth.signOut()} src={user.photoURL} />
            <IconContainer>
                <IconButton><Chat /></IconButton>
                <IconButton><MoreVert/></IconButton>
                
            </IconContainer>
        </Header>
        <SearchContainer>
            <Search />
            <SearchInput placeholder="Search in Chats" />
        </SearchContainer>
        <NewChatButton onClick={createChat}>
            Start a New Chat
        </NewChatButton>
        {/* List of Chats */}
        {chatSnapShot?.docs.map(chat=>(
            <ChatField key={chat.id} id={chat.id} users={chat.data().users}  />
        ))}
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
display: flex;
align-items: center; 
position: sticky;
top: 0; 
z-index: 2;
justify-content: space-between;
border-bottom: 1px solid whitesmoke;
padding: 15px;
height: 80px;
background-color: white;
`;

const UserAvatar = styled(Avatar)`
    margin: 10px;
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }
`;

const IconContainer = styled.div`

`;

const SearchContainer = styled.div`
display: flex;
align-items: center; 
padding: 20px;
border-radius: 2px;

`;

const SearchInput = styled.input`
    outline-width: 0;
    flex: 1;
    border: none;
`;
const NewChatButton = styled(Button)`
    width: 100%;

    &&&{ //For Priority
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
    
    
`;