import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

export default function TopBar() {

    return (
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar >
            <Typography variant="h6" noWrap component="div">
                KMon
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', mr: 5}}>
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
    )
};