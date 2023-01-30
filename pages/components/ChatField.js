import { auth, db } from '@/firebase';
import { Avatar } from '@material-ui/core';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from'styled-components';
import getRecipientEmail from '../../utils/getRecipientEmail';
import { useRouter} from "next/router";

function ChatField({id, users}) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientQuery = query(collection(db, "users"),where("email", "==", getRecipientEmail(users, user)));
  const [recipientSnapShot] = useCollection(recipientQuery);
  const recipient = recipientSnapShot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  const letsChat = ()=>{
    router.push(`/chat/${id}`);
  }

  return (
    <Container onClick={()=> letsChat()}>
      {
        recipient ? (<UserAvatar src={recipient?.photoURL} />) : (<UserAvatar >{recipientEmail[0].toUpperCase()}</UserAvatar>)
      }
      <p>{recipientEmail}</p>

    </Container>
  )
}

export default ChatField;

const Container = styled.div`
display: flex;
align-items: center;
padding: 15px;
cursor: pointer;
word-break: break-word;


  :hover{
    background: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
