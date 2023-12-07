import React from 'react';
import { Container } from '@mui/material'
import BrokerContainer from '../GraphContainers/BrokerContainer.jsx';
const Brokers = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px'
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Brokers Page</h1>

      <BrokerContainer/>

  </Container>
  );
};

export default Brokers;