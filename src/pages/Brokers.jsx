import React from 'react';
import { Container } from '@mui/material'
import BrokerContainer from '../GraphContainers/BrokerContainer.jsx';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const Brokers = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Brokers Page</h1>
      <BrokerContainer/>
  </Container>
  );
};

export default Brokers;
