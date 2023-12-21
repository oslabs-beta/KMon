import React from 'react';
import ConnectionsTable from '../components/ConnectionsTable.jsx';
import ConnectionDialogBox from '../components/ConnectionDialogBox.jsx';
import { Container } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const Connections = () => {
  const theme = useTheme();

  return (
    <Container>
      <div>
        <h1>Welcome back. Your connections: </h1>
        <ConnectionDialogBox />
      </div>
      <ConnectionsTable />
    </Container>
  );
};

export default Connections;
