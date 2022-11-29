import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

export default function LabelledDropdown(props) {
    console.log(props)
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{props.placeholder}</InputLabel>
                <Select
                    defaultValue={props.defaultValue}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label={props.label}
                    value={props.options[0]}
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