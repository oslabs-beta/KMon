// import React from 'react';
// import { useState, useMemo } from 'react';
// import { Container, Box } from '@mui/material'
// import SortableList from '../components/dnd/SortableList.jsx';

// import BytesInBytesOut from '../GraphComponents/BytesinBytesOut.jsx';
// import CpuUsage from '../GraphComponents/CpuUsage.jsx';
// import DiskIO from '../GraphComponents/DiskIO.jsx';
// import MemoryUse from '../GraphComponents/MemoryUse.jsx';
// import ProducerLatency from '../GraphComponents/ProducerLatency.jsx';
// import UnderReplication from '../GraphComponents/UnderReplication.jsx';

// import { styled } from '@mui/system';
// import { useTheme } from '@mui/material/styles';

// // SortableList implemented here as an example
// const Brokers = () => {
//   const theme = useTheme();

//   const [active, setActive] = useState(null);
//   const [items, setItems] = useState([
//     {id: 1, component: <BytesInBytesOut active/>},
//     {id: 2, component: <CpuUsage/>},
//     {id: 3, component: <DiskIO/>},
//     {id: 4, component: <MemoryUse/>},
//     {id: 5, component: <ProducerLatency/>},
//     {id: 6, component: <UnderReplication/>},
//   ]);

//   const containerStyle = {
//     marginLeft: theme.margins.sideBarMargin,
//     marginTop: theme.margins.headerMargin,
//     height: '100vh',
//     // border: '1px solid blue',
//     padding: '20px'
//   };

//   const dndContainerStyle = {
//     // border: '1px solid black',
//     display: 'flex',
//     flexWrap: 'wrap'
//   }

//   return (
//     <Box className='pageContainer' sx={containerStyle}>
//     <h1>This is the Brokers Page</h1>

//       <Box className='dndContainer' sx={dndContainerStyle}>
//           <SortableList
//             items={items} 
//             onChange={setItems} 
//             active={active} 
//             setActive={setActive} 
//           />
//       </Box>
//     </Box>
//   );
// };

// export default Brokers;
