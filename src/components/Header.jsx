import React from 'react';
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

function Header() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            KMon
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              mr: 5,
            }}
          >
            <Stack direction="row" spacing={0}>
              <IconButton aria-label="settings">
                <SettingsIcon />
              </IconButton>
              <IconButton aria-label="person">
                <PersonIcon />
              </IconButton>
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
