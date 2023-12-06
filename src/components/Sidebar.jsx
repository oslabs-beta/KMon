import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

const drawerWidth = 240;

function Sidebar() {
  const linkStyles = {
    textDecoration: 'none',
    color: 'black'
  }

  const StyledDrawer = styled(Drawer)({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      marginTop: '70px',
      }
    });

    const StyledListItem = styled(ListItem)({
      textDecoration: 'none',
      color: 'black',
    });

  return (
    <Box sx={{ display: 'flex' , marginRight: '0px'}}>
      <CssBaseline />
      <StyledDrawer variant="permanent" anchor ="left">
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {['Overview', 'Brokers', 'Producers', 'Consumers'].map((text, index) => (
              <StyledListItem key={text} component={Link} to={"/" + text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </StyledListItem>
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
      </StyledDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      </Box>
    </Box>
  )
};

export default Sidebar;
