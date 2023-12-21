import React from 'react';
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
import AccountMenu from './AccountMenu.jsx';
import { useTheme} from "@mui/material/styles";
import logoImage from '../../assets/kmon2.png';
import { NavLink } from 'react-router-dom';

const drawerWidth = 240;

const AccountMenuBox = styled(Box)(({ theme }) => ({
  position: 'fixed', // Use 'fixed' positioning
  top: 16, // Place it at the top of the viewport
  left: 140, // Place it at the right of the viewport
  zIndex: theme.zIndex.drawer + 1, // Ensure it's above the drawer
  padding: theme.spacing(1), // Adjust as needed
}));



function Sidebar(props) {

  const theme = useTheme();
  const backColor = theme.palette.customColor.dark


  const { onLogout } = props;

  const linkStyles = {
    textDecoration: 'none',
    color: 'black',
  };

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      marginTop: 0,
      paddingTop: 0,
      }
    }));

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
    <AccountMenuBox>
      <AccountMenu onLogout={onLogout} />
    </AccountMenuBox>
    <StyledDrawer variant="permanent" anchor="left">
      <Box sx={{ overflow: "auto" }}>
        <List sx = {{marginTop: '100px'}} >
          {[
            "Connections",
            "Dashboard",
          ].map((text, index) => (
            
            <StyledListItem 
              key={text}
              component={NavLink}
              to={"/" + text}
              activeClassName="activeLink"
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
              component={NavLink}
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
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            left: '5px',
            padding: '8px', // Adjust as needed
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
        <img src={logoImage} alt="Logo" width="60px" height="60px" />
        </Box>
    </StyledDrawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}></Box>
  </Box>
);
};

export default Sidebar;
