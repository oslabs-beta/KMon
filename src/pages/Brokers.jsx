import React from 'react';

// import "react-resizable/css/styles.css";

import { useState, useMemo } from 'react';
import { Container, Box } from '@mui/material'
import MetricGroupContext from '../components/dnd/MetricGroupContext.jsx';

import BytesInBytesOut from '../GraphComponents/BytesinBytesOut.jsx';
import { useTheme } from '@mui/material/styles';
import { DashboardContext, ItemSizeContext } from '../context/DashboardContext.jsx';

// SortableList implemented here as an example
const Brokers = () => {
  const [itemSizes, setItemSizes] = useState([
    { id: 1, width: 550, height: 250},
    { id: 2, width: 550, height: 250},
    { id: 3, width: 550, height: 250},
  ]);
console.log('itemSizes from Brokers', itemSizes);
  const [items, setItems] = useState([
    { id: 1, component: <BytesInBytesOut itemSizes={itemSizes} id={1}/> },
    { id: 2, component: <BytesInBytesOut itemSizes={itemSizes} id={2}/> },
    { id: 3, component: <BytesInBytesOut itemSizes={itemSizes} id={3}/> },
  ]);

  // let newItems = [...items];
  // let newItemSizes = [...itemSizes];
  // newItemSizes[0].width = 0;
  // newItems[0].component.itemSizes = newItemSizes;

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
      <ItemSizeContext.Provider value={[itemSizes, setItemSizes]}>
        <MetricGroupContext/>
      </ItemSizeContext.Provider>
    </DashboardContext.Provider>
    {/* <MetricGroup/> */}
    </Box>
  );
};

export default Brokers;
