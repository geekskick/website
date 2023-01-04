
import React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar';
import { List, ListItemButton, ListItemText, ListItemIcon, Tooltip, Box } from '@mui/material';
import Config from '../config'
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';
import AppFactory from '../available_apps';

export function SidebarContents(props) {
    return (<List>
        {props.apps.map(appName => {
            return (
                <ListItemButton key={appName} onClick={() => {
                    console.log("CLicked ", appName);
                    props.onAppSelect(appName);
                }}>
                    <ListItemIcon>
                        {AppFactory.getIconForApp(appName)}
                    </ListItemIcon>
                    <ListItemText primary={appName} />
                </ListItemButton>);
        })
        }
    </List>);
}


export function SidebarFooter() {
    return <List>
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
}

export default function Sidebar(props) {

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
        <SidebarContents apps={props.apps} onAppSelect={props.onAppSelect} />
        <Divider />
        <SidebarFooter />
    </Drawer>);
}