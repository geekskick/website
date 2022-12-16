
import React from 'react';
import Divider from '@mui/material/Divider';
import AboutDialog from './about_dialog';
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar';
import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

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
        <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
    </Drawer>);
}