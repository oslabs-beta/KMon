import React from 'react';
import { useState, useMemo } from 'react';
import { Container, Box } from '@mui/material'
import BrokerContainer from '../GraphContainers/BrokerContainer.jsx';
import { SortableList } from '../components/dnd/SortableList.jsx';

import {DndContext, closestCenter} from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities";
import {SortableContext, useSortable, arrayMove, horizontalListSortingStrategy, verticalListSortingStrategy} from '@dnd-kit/sortable';
import BytesInBytesOut from '../GraphComponents/BytesinBytesOut.jsx';
import CpuUsage from '../GraphComponents/CpuUsage.jsx';
import DiskIO from '../GraphComponents/DiskIO.jsx';
import MemoryUse from '../GraphComponents/MemoryUse.jsx';
import ProducerLatency from '../GraphComponents/ProducerLatency.jsx';
import UnderReplication from '../GraphComponents/UnderReplication.jsx';
import { DragHandle, SortableItem } from '../components/dnd/SortableItem.jsx';

const Brokers = () => {
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
    border: '1px solid blue',
    padding: '20px'

  };

  return (
    <Box className='pageContainer' sx={containerStyle}>
    <h1>This is the Brokers Page</h1>
    {/* <BrokerContainer/> */}

    <Box className='DndContainer' sx={{
      border: '1px solid black',
      display: 'flex',
      flexWrap: 'wrap'
    }}>

    <SortableList
        items={items}
        onChange={setItems}
        active={active}
        setActive={setActive}
        renderItem={(item) => (
          <SortableItem id={item.id} key={item.id}>
            {item.component}
            <DragHandle />
          </SortableItem>
        )}
      />
    </Box>
  </Box>
  );
};

export default Brokers;
