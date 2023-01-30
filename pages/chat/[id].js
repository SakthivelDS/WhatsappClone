import React from 'react'
import styled from'styled-components';
import Sidebar from "../components/Sidebar";
import ChatScreen from '../components/ChatScreen';
import { collection, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from "../../firebase"
import { doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';
function Chat({chat, messages}) {

    const [user] = useAuthState(auth);


  return (
    <Container>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        <Sidebar />
        <ChatContainer>
            <ChatScreen chat={chat} messages={messages} />
        </ChatContainer>
    </Container>
  )
}

export default Chat;

// ServerSide Rendering

export async function getServerSideProps(context){  
    const ref = doc(db, "chats",context.query.id);

    // Preparing the messages on the server

    const messagesRes = await query(collection(ref, "messages")
    ,orderBy("timestamp", "asc")
    );

    const messages = messagesRes?.docs?.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    .map((messages)=>({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }));

    // Preparing the chats

    const chatsRes = await getDoc(ref);
    const chat = {
        id: chatsRes.id,
        ...chatsRes.data(),
    }
    console.log(chat, messages);
    return {
        props: {
            messages: JSON.stringify(messages ? messages : []),
            chat: chat
        }
    }

}

const Container = styled.div`
    display: flex;  
`;
const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar{
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;