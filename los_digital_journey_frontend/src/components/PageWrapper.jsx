import React from 'react';
import Container from '@mui/material/Container';
import '../styles/global.css';
import { Box } from '@mui/material';

export default function PageWrapper({ children }) {
  // return <Container className="wrapper-container">{children}</Container>;
  return (
    <Container className='wrapper-main'>
      <Box className="wrapper-container">{children}</Box>
    </Container>
  );
}
