
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import PropTypes from 'prop-types';


DismissButton.propTypes = {
    key: PropTypes.string.isRequired,
    handleDismiss: PropTypes.func.isRequired,
};

export default function DismissButton(props) {
    console.log('DismissButton::props = ', props);
    return (
        <Button
            sx={{
                color: 'white',
            }}
            onClick={() => props.handleDismiss(props.key)}>
            <CloseIcon />
        </Button>);
}
