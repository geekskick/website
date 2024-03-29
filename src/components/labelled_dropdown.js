import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import PropTypes from 'prop-types';

LabelledDropdown.propTypes = {
    placeholder: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
};

export default function LabelledDropdown(props) {
    // TODO: figure out how to make the default selected value optional
    // https://reactjs.org/docs/uncontrolled-components.html
    // use defaultValue?
    return (
        <FormControl fullWidth>
            <InputLabel>{props.placeholder}</InputLabel>
            <Select
                label={props.label}
                onChange={props.onChange}
                value={props.value}
            >
                {
                    props.options.map((option) => {
                        return <MenuItem value={option} key={option}>{option}</MenuItem>;
                    })
                }
            </Select>
        </FormControl>);
}
