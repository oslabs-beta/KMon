import React from 'react';
import { Container } from '@mui/material';
// import PerformanceContainer from '../GraphContainers/PerformanceContainer.jsx';
import OverviewContainer from '../GraphContainers/OverviewContainer.jsx';
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
      <OverviewContainer />
    </Container>
  );
};

export default Overview;
