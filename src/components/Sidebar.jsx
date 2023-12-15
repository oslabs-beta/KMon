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
import { Inbox } from "@mui/icons-material";
import StreamIcon from "@mui/icons-material/Stream";
import CollectionsIcon from "@mui/icons-material/Collections";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import AddAlertIcon from "@mui/icons-material/AddAlert";


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
      marginTop: '65px',
      }
    });

    const StyledListItem = styled(ListItem)({
      textDecoration: 'none',
      color: 'black',
    });

    const iconsPapaer1 = [
      <CategoryIcon />,
      <StreamIcon />,
      <CollectionsIcon />,
      <InventoryIcon />,
      <Inbox />,
    ];

    const iconsPapaer2 = [<AddAlertIcon />];


  return (
    <Box sx={{ display: "flex", marginRight: "0px" }}>
    <CssBaseline />
    <StyledDrawer variant="permanent" anchor="left">
      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            "Overview",
            "Connections",
            "Brokers",
            "Producers",
            "Consumers",
          ].map((text, index) => (
            
            <StyledListItem 
              key={text}
              component={Link}
              to={"/" + text}
              disablePadding
            >
              
              <ListItemButton>
              {iconsPapaer1[index]}
                <ListItemText primary={text} sx ={{marginLeft: '10px'}} />
              </ListItemButton>
            </StyledListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Alerts"].map((text, index) => (
            <StyledListItem
              key={text}
              component={Link}
              to={"/" + text}
              disablePadding
            >
              <ListItemButton>
              {iconsPapaer2[index]}
                <ListItemText primary={text} sx ={{marginLeft: '10px'}}/>
              </ListItemButton>
            </StyledListItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
  </Box>
);
};

export default Sidebar;
