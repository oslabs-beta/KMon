import React, { useState } from 'react';
import { Box } from '@mui/material'
import MetricGroupContext from '../components/dnd/MetricGroupContext.jsx';

import BytesInBytesOut from '../GraphComponents/BytesinBytesOut.jsx';
import { useTheme } from '@mui/material/styles';
import DashboardContext from '../context/DashboardContext.jsx';

// SortableList implemented here as an example
const Brokers = () => {

  const [items, setItems] = useState([
    { id: 1, component: <BytesInBytesOut/>, width: 550, height: 250},
    { id: 2, component: <BytesInBytesOut/>, width: 550, height: 250},
    { id: 3, component: <BytesInBytesOut/>, width: 550, height: 250},
  ]);

  console.log(items);
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
    height: '100vh',
    border: '1px solid blue',
    padding: '20px'
  };

  return (
    <Box className='pageContainer' sx={containerStyle}>
      <h1>This is the Brokers Page</h1>
      <DashboardContext.Provider value={[items, setItems]}>
        <MetricGroupContext/>
      </DashboardContext.Provider>
    </Box>
  );
};

export default Brokers;
