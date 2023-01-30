import { Button } from '@material-ui/core';
import { signInWithPopup } from 'firebase/auth';
import React from 'react'
import styled from "styled-components";

import {auth, provider} from "../firebase";

function Loading() {

  return (
    <Container>
        <title>Loading</title>
        <LoginContainer>
            <Logo src="https://www.freepnglogos.com/uploads/whatsapp-logo-png-hd-2.png"></Logo>
            <h2>Loading...</h2>
        </LoginContainer>
    </Container>
  )
}

export default Loading;

const Container = styled.div`
display: grid;
place-items: center;
height: 100vh;
background-color:whitesmoke;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 100px;
  align-items: center;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 10px 20px rgba(0,0,0,0);

`;

const Logo = styled.img`
height: 150px;
width: 150px; 
margin-bottom: 50px;

`;


