import React from 'react';
import ConnectionsTable from '../components/ConnectionsTable.jsx';
import ConnectionDialogBox from '../components/ConnectionDialogBox.jsx';
import { Container } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

const Connections = () => {
  const theme = useTheme();

  const containerStyle = {
    marginLeft: theme.margins.sideBarMargin,
    marginTop: theme.margins.headerMargin,
  };

  return (
    <Container sx={containerStyle}>
      <div>
        <ConnectionDialogBox />
      </div>
      <ConnectionsTable />
    </Container>
  );
};

export default Connections;
