import React, { useState } from 'react';
import { Container } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const Overview = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  return (
    <Container sx={containerStyle}>
      <h1>This is the Overview Page</h1>
    </Container>
  );
};

export default Overview;

