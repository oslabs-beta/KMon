import React from 'react';
import { Container } from '@mui/material'
import ProducerContainer from '../GraphContainers/ProducerContainer.jsx';
const Producers = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px'
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Producers Page</h1>
    <ProducerContainer/>
  </Container>
  );
};

export default Producers;