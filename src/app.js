import React from 'react';
import './index.css';
import NavBar from './components/navbar';
import { useSnackbar } from 'notistack';
import DismissButton from './components/dismiss_button';
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/sidebar'
import AppFactory from './available_apps'
import ResponsiveSidebar from './components/responsive_sidebar';

const drawerWidth = 240;

export default function App(props) {
    console.log("App props = ", props);

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [selectedApp, setSelectedApp] = React.useState(AppFactory.getAvailableApps()[0]);

    const error = (message) => {
        console.log("error: ", message);
        enqueueSnackbar(
            message,
            {
                variant: 'error',
                action: (key) => { return <DismissButton handleDismiss={closeSnackbar} key={key} /> }
            });
    };

    const info = (message) => {
        console.log("info: ", message);
        enqueueSnackbar(
            message,
            {
                variant: 'info',
                //action: (key) => { console.log(`key = ${key}`); return <DismissButton handleDismiss={closeSnackbar} key={key} /> }
            });
    }
    const onAppSelect = (name) => {
        info("Selected '" + name + "'");
        setSelectedApp(name);
    }

    console.log("Selected app = ", selectedApp);
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <NavBar title={selectedApp} width={drawerWidth} handleDrawerToggle={() => { setMobileOpen(!mobileOpen); }} />
            <ResponsiveSidebar drawerWidth={drawerWidth} apps={AppFactory.getAvailableApps()} onAppSelect={onAppSelect} open={mobileOpen} handleDrawerToggle={() => { setMobileOpen(!mobileOpen); }} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                {AppFactory.create(selectedApp, info, error)}

            </Box>
        </Box >)
}