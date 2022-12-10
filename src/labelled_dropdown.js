import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

/**
 * 
 * @param {*} props 
 * @returns 
 */
export default function LabelledDropdown(props) {
    // TODO: figure out how to make the default selected value optional
    // https://reactjs.org/docs/uncontrolled-components.html
    // use defaultValue?
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel>{props.placeholder}</InputLabel>
                <Select
                    label={props.label}
                    onChange={props.onChange}
                >
                    {
                        props.options.map(option => {
                            return <MenuItem value={option} key={option}>{option}</MenuItem>;
                        })
                    }
                </Select>
            </FormControl>
        </div>);
}