import { Typography, Box } from '@mui/material';
import React from 'react';
import ErrorBoundary from './../../components/error_boundary';

export default function About(props) {
    console.log("About::props = ", props);
    return (<ErrorBoundary onError={props.error}>
        <Box>
            <Typography>This website has been made mostly as a way of learning about React and different technologies which I'm not too familiar with. If there's an issue use the 'Report a Bug' option in the menu to raise a bug on github against this site.</Typography>
        </Box>
    </ErrorBoundary>);
}