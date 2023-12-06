import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';

function Header() {

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
        <CssBaseline />
        <StyledAppBar position="fixed" >
            <StyledToolbar >
            <Typography variant="h6" noWrap component="div">
                KMon
            </Typography>
                <StyledNestedBox >
                <Stack direction="row" spacing={0}>
                    <IconButton aria-label="settings">
                        <SettingsIcon />
                    </IconButton>
                    <IconButton aria-label="person">
                        <PersonIcon />
                    </IconButton>
                </Stack>
                </StyledNestedBox>
            </StyledToolbar>
        </StyledAppBar>
    </StyledBox>
    )
};

export default Header;
