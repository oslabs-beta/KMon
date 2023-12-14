import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  CssBaseline,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/system';

const drawerWidth = 240;

function Sidebar() {
  const linkStyles = {
    textDecoration: 'none',
    color: 'black',
  };

  const StyledDrawer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      marginTop: '75px',
    },
  });

  const StyledListItem = styled(ListItem)({
    textDecoration: 'none',
    color: 'black',
  });

  return (
    <Box sx={{ display: 'flex', marginRight: '0px' }}>
      <CssBaseline />
      <StyledDrawer variant="permanent" anchor="left">
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              'Overview',
              'Connections',
              'Brokers',
              'Producers',
              'Consumers',
            ].map((text, index) => (
              <StyledListItem
                key={text}
                component={Link}
                to={'/' + text}
                disablePadding
              >
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </StyledListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Alerts'].map((text, index) => (
              <StyledListItem
                key={text}
                component={Link}
                to={'/' + text}
                disablePadding
              >
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </StyledListItem>
            ))}
          </List>
        </Box>
      </StyledDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
    </Box>
  );
}

export default Sidebar;
