import React, { useState } from 'react';
import { Container } from '@mui/material'
import ProducerContainer from '../GraphContainers/ProducerContainer.jsx';

import SortableList from '../components/dnd/SortableList.jsx';
import { DragHandle, SortableItem } from '../components/dnd/SortableItem.jsx';

import BytesInBytesOut from '../GraphComponents/BytesinBytesOut.jsx';
import CpuUsage from '../GraphComponents/CpuUsage.jsx';
import DiskIO from '../GraphComponents/DiskIO.jsx';
import MemoryUse from '../GraphComponents/MemoryUse.jsx';
import ProducerLatency from '../GraphComponents/ProducerLatency.jsx';
import UnderReplication from '../GraphComponents/UnderReplication.jsx';
const Producers = () => {
  const [active, setActive] = useState(null);
  const [items, setItems] = useState([
    {id: 1, component: <BytesInBytesOut active/>},
    {id: 2, component: <CpuUsage/>},
    {id: 3, component: <DiskIO/>},
    {id: 4, component: <MemoryUse/>},
    {id: 5, component: <ProducerLatency/>},
    {id: 6, component: <UnderReplication/>},
  ]);

  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
    height: '100vh',
    padding: '20px',
    display: 'flex',
    flexWrap: 'wrap'
  };

  return (
    <Container sx={containerStyle}>
    <h1>This is the Producers Page</h1>
    <SortableList
            items={items} 
            onChange={setItems} 
            active={active} 
            setActive={setActive} 
      />
  </Container>
  );
};

export default Producers;
