import React, { useState } from 'react';
import { Container } from '@mui/material'
import ProducerContainer from '../GraphContainers/ProducerContainer.jsx';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const Producers = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Producers Page</h1>
  </Container>
  );
};

export default Producers;
