
import React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { List, ListItemButton, ListItemText, ListItemIcon, Tooltip, Box } from '@mui/material';
import Config from '../config';
import GitHubIcon from '@mui/icons-material/GitHub';
import BugReportIcon from '@mui/icons-material/BugReport';
import AppFactory from '../available_apps';
import PropTypes from 'prop-types';

SidebarContents.propTypes = {
    apps: PropTypes.arrayOf(PropTypes.string).isRequired,
    onAppSelect: PropTypes.func.isRequired,
};

export function SidebarContents(props) {
    return (<List>
        {props.apps.map((appName) => {
            return (
                <ListItemButton key={appName} onClick={() => {
                    console.log('CLicked ', appName);
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
            align: 'center',
        }}>
            <Tooltip title="View the source">
                <Button href={Config.GITHUB_URL} target="_blank">
                    <GitHubIcon />
                </Button>
            </Tooltip>
            <Tooltip title="Report a bug">
                <Button href={Config.GITHUB_URL} target="_blank">
                    <BugReportIcon />
                </Button>
            </Tooltip>
        </Box>
    </List>;
}

Sidebar.propTypes = {
    width: PropTypes.number.isRequired,
    apps: PropTypes.arrayOf(PropTypes.string).isRequired,
    onAppSelect: PropTypes.func.isRequired,
};
export default function Sidebar(props) {
    return (<Drawer
        sx={{
            'width': props.width,
            'flexShrink': 0,
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
