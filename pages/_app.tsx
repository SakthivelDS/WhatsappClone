import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {useAuthState} from "react-firebase-hooks/auth";
import {db, auth} from "../firebase";
import Login from "./Login";
import Loading from "./Loading";
import { useEffect } from 'react';

import {addDoc,updateDoc, collection, doc, serverTimestamp, setDoc} from "firebase/firestore";
import { User } from 'firebase/auth';

export default function App({ Component, pageProps }: AppProps) {

  const [user, loading] = useAuthState(auth);

  const userUpdateFirebase = (user: User)=>{
    const userRef = doc(db, "users",user.uid);
    setDoc(userRef, {
      displayName: user.displayName,
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
      lastSeen: serverTimestamp()
    },{
      merge: true,
    })

  }

  useEffect(()=>{
    if(user){
      console.log(user);
      userUpdateFirebase(user)
      
    }
  },[user])
  
  if(loading) {
    return (
    <Loading />
    )
  }

  if(!user) {
    return (
      <Login />
      
    )
  }
  
  return <Component {...pageProps} />
}

