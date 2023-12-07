import React from 'react';
import { Container } from '@mui/material'
import PerformanceContainer from '../GraphContainers/PerformanceContainer.jsx';
const Brokers = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px'
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Brokers Page</h1>

      <PerformanceContainer/>

  </Container>
  );
};

export default Brokers;