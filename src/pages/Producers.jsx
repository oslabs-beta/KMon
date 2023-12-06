import React from 'react';
import { Container } from '@mui/material'

const Producers = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px'
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Producers Page</h1>
  </Container>
  );
};

export default Producers;