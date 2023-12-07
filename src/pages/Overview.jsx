import React from 'react';
import { Container } from '@mui/material';
// import PerformanceContainer from '../GraphContainers/PerformanceContainer.jsx';
import OverviewContainer from '../GraphContainers/OverviewContainer.jsx';

const Overview = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

  return (
    <Container sx={containerStyle}>
      <h1>This is the Overview Page</h1>
      <OverviewContainer />
    </Container>
  );
};

export default Overview;

