import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar(props) {
    console.log("NavBar props = ", props);
    return (
        <AppBar position="fixed"
            sx={{
                justifyContent: 'space-between',
                backgroundColor: 'green',
                width: { sm: `calc(100% - ${props.width}px)` },
                ml: { sm: `${props.width}px` }
            }}>
            <Toolbar>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={props.handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
                <Typography variant="h6" noWrap component="div">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar >

    );
}
