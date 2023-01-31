import { Avatar } from '@material-ui/core';
import { AttachFile, InsertEmoticon, Mic, MoreVert, Send } from '@material-ui/icons';
import { addDoc, collection, doc, getDoc, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components';
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';
import Message from './Message';
import TimeAgo from "timeago-react"

function ChatScreen({chat, messages}) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessageRef = useRef(null);
  const [input , setInput] = useState("");

  const messagesQuery = doc(db,"chats", router.query.id);
  const messageSnapShotQuery2 = query(collection(messagesQuery, "messages"), orderBy("timestamp", "asc"));
  const [messageSnapShot] = useCollection(messageSnapShotQuery2)

  const showMessages = ()=>{
      if(messageSnapShot){
        return messageSnapShot.docs.map((message) => {
          return (
            <Message key={message.id} user={message.data().user} message={{...message.data(), timestamp: message.data().timestamp?.toDate().getTime()}} />
          )
        })  
      }
      else{
        // JSON.parse(messages).map((message) => console.log("data: "+message.data()))
        return JSON.parse(messages).map((message) =>(
          <Message key={message.id} user={message.data().user} message={{...message.data(), timestamp: message.data().timestamp?.toDate().getTime()}} />
        ))
      }
  }

  const sendMessage = (e)=>{
    e.preventDefault();
    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, {
      lastSeen: serverTimestamp()
    },{
      merge: true,
    })
    const chatsRef = doc(db, "chats", router.query.id);
    const messageRef = collection(chatsRef, "messages");
    addDoc(messageRef, {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL   
    })
    setInput("");
    scrollToBottom();
  }

  const recipientEmail = getRecipientEmail(chat.users, user);
  // // console.log("recipient email: "+recipientEmail)
  const recipientQuery = query(collection(db, "users"), where("email", "==", recipientEmail));
  
  const [recipientSnapShot] = useCollection(recipientQuery);
  const recipient = recipientSnapShot?.docs?.[0]?.data();
  
  const scrollToBottom = ()=>{
    endOfMessageRef.current.scrollIntoView({
       behavior: "smooth",
        block: "start"
      });
  }

  return (
    <Container>
      <Header>
          {
            recipient ? <Avatar src={recipient.photoURL} /> : <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
          }
          <HeaderInformation>
            <h3>{recipientEmail}</h3>
            {
              recipientSnapShot ? (
                <p>Last Active: {' '}
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : "unavailable"
              }
                </p>
              )
              : (
                <p>Loading Last Active..</p>
              )
            }
          </HeaderInformation>
          <HeaderIcons>
              <AttachFile />
              <MoreVert />
          </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage  ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon />
        <InputMessage value={input} onChange={e=> setInput(e.target.value)} />
        <button onClick={sendMessage} disabled={!input} hidden >Send message</button>
        <Mic />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div`
  font-family:Arial, Helvetica, sans-serif;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex:1;
  > h3{
    margin-bottom: 3px;
  }
  > p{
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
/* background-color: red; */
margin-bottom: 50px;

`;

const InputContainer = styled.form`
  
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const InputMessage = styled.input`
  flex:1;
  /* margin-left: 5px;
  margin-right: 5px; */
  outline:0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin-left: 15px;
  margin-right: 15px;
`;
