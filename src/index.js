import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NavBar from './navbar';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Button from '@mui/material/Button'
import DismissButton from './dismiss_button';
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './sidebar.js'
import CanICatchItApp from './can_i_catch_it_app';
const drawerWidth = 240;


function App(props) {
    console.log("App props = ", props);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const error = (message) => {
        console.log("errro: ", message);
        enqueueSnackbar(
            message,
            {
                key: Math.random(),
                variant: 'error',
                action: key => { return <DismissButton handleDismiss={closeSnackbar} key={key} /> }
            });
    };

    const info = (message) => {
        console.log("info: ", message);
        enqueueSnackbar(
            message,
            {
                key: Math.random(),
                variant: 'info',
                action: key => { return <Button onClick={() => closeSnackbar(key)}>Dismiss</Button> }
            });
    }

    const onGenericError = (errorM, info) => {
        error(errorM + info);
    }


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <NavBar title={"Can I Catch It?"} width={`calc(100% - ${drawerWidth}px)`} />
            <Sidebar width={drawerWidth} />
            {/*<AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />*/}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3
                }}>
                <Toolbar />
                <CanICatchItApp
                    info={info}
                    error={onGenericError}
                    pokemonNames={props.pokemonNames}
                    generations={props.generations}
                    api={props.api} />
            </Box>
        </Box >)
}

function AppView() {

    return (
        <SnackbarProvider maxSnack={3}>
            <App
            />
        </SnackbarProvider>);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
(async () => {
    try {
        root.render(<AppView />);
    } catch (error) {
        console.log("Error = ", error);
    }
})()
