import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import PropTypes from 'prop-types';

const LevelSlider = styled(Slider)(({ theme }) => ({
    'height': 2,
    'padding': '15px 0',
    // The dragger
    '& .MuiSlider-thumb': {
        backgroundColor: 'blue',
        // margin: '-18px 0 0',
        borderRadius: '50%',
        background: 'white',
        cursor: 'pointer',
        border: 0,
    },
    '& .MuiSlider-track': {
        // opacity: 1,
        backgroundColor: 'darkgrey',
        border: 'solid',
        borderColor: 'black',
        height: '10px',
        borderRadius: 0,
    },
    '& .MuiSlider-rail': {
        border: 'solid',
        opacity: 1,
        // width: '10px',
        height: '10px',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 0,
    },
}));

const Input = styled(MuiInput)(({ theme }) => ({
    width: '50px',
}));

InputSlider.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeCommitted: PropTypes.func.isRequired,
};

export default function InputSlider(props) {
    const [value, setValue] = React.useState(props.value);
    const min = 1;
    const max = 100;
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
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
                    <LevelSlider
                        value={value}
                        onChange={handleSliderChange}
                        onChangeCommitted={props.onChangeCommitted}
                        aria-labelledby="input-slider"
                        valueLabelDisplay='on'
                        valueLabelFormat={(x) => `Pokemon is at Level ${x}`}
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        inputProps={{
                            step: 1,
                            min: { min },
                            max: { max },
                            type: 'number',
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
