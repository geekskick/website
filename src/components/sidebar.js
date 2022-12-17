
import React from 'react';
import Divider from '@mui/material/Divider';
import AboutDialog from './about_dialog';
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import AppsIcon from '@mui/icons-material/Apps';
import Toolbar from '@mui/material/Toolbar';
import { List, ListItemButton, ListItemText, ListItemIcon, Tooltip, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Config from '../config'
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function Sidebar(props) {
    const [aboutOpen, setAboutOpen] = React.useState(false);

    /**
         * The about window uses a single state variable to indicate if it's open or not.
         * This sets that variable to true, thus opening the window on the next render
         */
    const handleAboutClick = () => {
        setAboutOpen(true);
    }

    /**
     * The about window uses a single state variable to indicate if it's open or not.
     * This sets that variable to false, thus closing the window on the next render
     */
    const handleAboutClose = () => {
        setAboutOpen(false);
    }

    const appOptions = [];

    props.apps.forEach(appName => {
        appOptions.push(
            <ListItemButton key={appName} onClick={() => {
                console.log("CLicked ", appName);
                props.onAppSelect(appName);
            }}>
                <ListItemIcon>
                    <AppsIcon />
                </ListItemIcon>
                <ListItemText primary={appName} />
            </ListItemButton>);
    });

    console.log("AppPptions = ", appOptions);

    return (<Drawer
        sx={{
            width: props.width,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: props.width,
                boxSizing: 'border-box',
            },
        }}
        variant="permanent"
        anchor="left"
    >
        <Toolbar />
        <List>
            <ListItemButton onClick={handleAboutClick}>
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
            </ListItemButton>
        </List>
        <Divider />
        <List>
            {appOptions}
        </List>
        <Divider />
        <List>
            <Box sx={{
                justifyContent: 'space-evenly',
                align: 'center'
            }}>
                <Tooltip title="View the source">
                    <Button href={Config.GITHUB_URL}>
                        <GitHubIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Report a bug">
                    <Button href={Config.GITHUB_URL}>
                        <BugReportIcon />
                    </Button>
                </Tooltip>
            </Box>
        </List>

        <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
    </Drawer>);
}