import React from 'react';
import { Container } from '@mui/material';

const Consumers = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

  return (
    <Container sx={containerStyle}>
      <h1>This is the Consumers Page</h1>
    </Container>
  );
};

export default Consumers;
