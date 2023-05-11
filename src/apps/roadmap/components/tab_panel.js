import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function TabPanel(props) {
    const hidden = props.value !== props.index;
    return (
        <div hidden={hidden}>
            {!hidden && (
                <Box sx={{ p: 3 }}>
                    {props.children}
                </Box>
            )}
        </div>
    );
}
