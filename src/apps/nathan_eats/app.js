import { Typography, Box } from '@mui/material';
import React from 'react';
import ErrorBoundary from './../../components/error_boundary';
import PropTypes from 'prop-types';

NathanEats.propTypes = {
    error: PropTypes.string.isRequired,
};

export default function NathanEats(props) {
    console.log('NathanEats::props = ', props);
    return (<ErrorBoundary onError={props.error}>
        <Box>
            <Typography>Pussy</Typography>
        </Box>
    </ErrorBoundary>);
}
