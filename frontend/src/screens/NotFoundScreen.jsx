import React from 'react';
import { keyframes } from 'styled-components';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import { LinkContainer } from 'react-router-bootstrap';

// Keyframes for the animation
const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
`;

// Styled component for the 404 screen
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  animation: ${slideIn} 0.5s ease-in;
`;

const NotFoundText = styled.h1`
  font-size: 48px;
  margin-bottom: 16px;
`;

const NotFoundScreen = () => {
  return (
    <NotFoundContainer>
      <NotFoundText><i>404 Not Found</i></NotFoundText>
      <LinkContainer to='/'>
      <Button variant="contained" color="primary">
        Go Home
        </Button>
        </LinkContainer>
    </NotFoundContainer>
  );
};

export default NotFoundScreen;
