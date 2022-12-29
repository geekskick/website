import { Typography, Box } from '@mui/material';
import React from 'react';
import ErrorBoundary from './../../components/error_boundary';

export default function About(props) {
    console.log("About::props = ", props);
    return (<ErrorBoundary onError={props.error}>
        <Box>
            <Typography>About</Typography>
        </Box>
    </ErrorBoundary>);
}