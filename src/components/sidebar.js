
import React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import AppsIcon from '@mui/icons-material/Apps';
import Toolbar from '@mui/material/Toolbar';
import { List, ListItemButton, ListItemText, ListItemIcon, Tooltip, Box } from '@mui/material';
import Config from '../config'
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';

export default function Sidebar(props) {
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

    </Drawer>);
}