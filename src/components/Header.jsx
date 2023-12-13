import React from 'react';
import AccountMenu from './AccountMenu.jsx';
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

function Header(props) {
  const { onLogout } = props;

  const StyledBox = styled('div')({
      display: 'flex',
      flexDirection: 'row',
      
    });

  const StyledAppBar = styled(AppBar)({
    zIndex: (theme) => theme.zIndex.drawer + 1,
  });

  const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
  });

  const StyledNestedBox = styled(StyledBox)({
    justifyContent: 'flex-end',
    marginRight: 5,
  });

  return (
    <StyledBox>
        <StyledAppBar position="fixed" >
            <StyledToolbar >
            <Typography variant="h6" noWrap component="div">
                KMon
            </Typography>
                <StyledNestedBox >
                <Stack direction="row" spacing={0}>
                    {/* <IconButton aria-label="settings">
                        <SettingsIcon />
                    </IconButton>
                    <IconButton aria-label="person">
                        <PersonIcon />
                    </IconButton> */}
              <AccountMenu onLogout={onLogout} />
            </Stack>
          </StyledNestedBox>
        </StyledToolbar>
      </StyledAppBar>
    </StyledBox>
  );
}

export default Header;
