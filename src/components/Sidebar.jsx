import React from 'react';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

function Sidebar() {
  const linkStyles = {
    textDecoration: 'none',
    color: 'black',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '70px',
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              'Overview',
              'Connections',
              'Brokers',
              'Producers',
              'Consumers',
            ].map((text, index) => (
              <ListItem
                key={text}
                component={Link}
                to={'/' + text}
                sx={linkStyles}
                disablePadding
              >
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Alerts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
}

export default Sidebar;
