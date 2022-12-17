import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider(props) {


    const handleSliderChange = (event, newValue) => {
        props.onChange(newValue);
    };

    const handleInputChange = (event) => {
        if (event.target.value !== '') {
            props.onChange(event.target.value);
        }
    };

    return (
        <Box >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        value={props.value}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={props.value}
                        size="small"
                        onChange={handleInputChange}
                        inputProps={{
                            step: 1,
                            min: 1,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}