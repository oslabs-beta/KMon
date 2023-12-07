import React from 'react';
import { Container } from '@mui/material'
import ConsumerContainer from '../GraphContainers/ConsumerContainer.jsx';

const Consumers = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px'
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Consumers Page</h1>
    <ConsumerContainer/>
  </Container>
  );
};

export default Consumers;