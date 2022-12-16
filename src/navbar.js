import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
//import './index.css'
export default function NavBar(props) {
    console.log("NavBar props = ", props);
    return (
        <AppBar position="fixed"
            sx={{
                width: props.width,
                ml: `${props.width}px`,
                justifyContent: 'space-between'
            }}>
            <Toolbar>
                <Typography variant="h6">
                    {props.title}
                </Typography>
            </Toolbar>
        </AppBar >

    );
}
