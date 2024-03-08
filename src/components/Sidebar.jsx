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
import StreamIcon from "@mui/icons-material/Stream";
import CollectionsIcon from "@mui/icons-material/Collections";
import CategoryIcon from "@mui/icons-material/Category";
import AddAlertIcon from "@mui/icons-material/AddAlert";


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
    ];

    const iconsPapaer2 = [<AddAlertIcon />];


  return (
    <Box sx={{ display: "flex", marginRight: "0px" }}>
    <CssBaseline />
    <StyledDrawer variant="permanent" anchor="left">
      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            "Connections",
            "Dashboard",
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
    {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box> */}
  </Box>
);
};

export default Sidebar;
