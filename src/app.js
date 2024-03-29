import React from 'react';
import './index.css';
import NavBar from './components/navbar';
import { useSnackbar } from 'notistack';
import DismissButton from './components/dismiss_button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import AppFactory from './available_apps';
import ResponsiveSidebar from './components/responsive_sidebar';
import { Typography, AppBar } from '@mui/material';

const drawerWidth = 240;

export default function App(props) {
    console.log('App props = ', props);

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selectedApp, setSelectedApp] = React.useState(AppFactory.getAvailableApps()[0]);

    const error = (message) => {
        console.log('error: ', message);
        enqueueSnackbar(
            message,
            {
                variant: 'error',
                action: (key) => {
                    return <DismissButton handleDismiss={closeSnackbar} key={key} />;
                },
            });
    };

    const info = (message) => {
        console.log('info: ', message);
    };

    const onAppSelect = (name) => {
        info('Selected \'' + name + '\'');
        setSelectedApp(name);
    };

    console.log('Selected app = ', selectedApp);
    console.log('Version = ' + process.env.REACT_APP_VERSION);
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <NavBar title={selectedApp} width={drawerWidth} handleDrawerToggle={() => {
                setMobileOpen(!mobileOpen);
            }} />
            <ResponsiveSidebar
                drawerWidth={drawerWidth}
                apps={AppFactory.getAvailableApps()}
                onAppSelect={onAppSelect}
                open={mobileOpen}
                handleDrawerToggle={() => {
                    setMobileOpen(!mobileOpen);
                }} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {AppFactory.create(selectedApp, info, error)}
            </Box>
            <AppBar position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    top: 'auto',
                    bottom: 0,
                    textAlign: 'center',
                    bgcolor: 'green',
                }}
            >
                <Typography>Version {process.env.REACT_APP_VERSION}</Typography>
            </AppBar>
        </Box >);
}
