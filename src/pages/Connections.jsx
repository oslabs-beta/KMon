import React from 'react';
import ConnectionsTable from '../components/ConnectionsTable.jsx';
import ConnectionDialogBox from '../components/ConnectionDialogBox.jsx';
import { Container } from '@mui/material';

const Connections = () => {
  const containerStyle = {
    marginLeft: '240px',
    marginTop: '30px',
  };

  return (
    <Container sx={containerStyle}>
      <div>
        <h1>Saved Connections</h1>
        <ConnectionDialogBox />
      </div>
      <ConnectionsTable />
    </Container>
  );
};

export default Connections;
