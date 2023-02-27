import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

const HPSlider = styled(Slider)(({ theme }) => ({
    height: 2,
    padding: '15px 0',
    // The dragger
    '& .MuiSlider-thumb': {
        backgroundColor: 'blue',
        //margin: '-18px 0 0',
        borderRadius: '50%',
        background: 'white',
        cursor: 'pointer',
        border: 0,
    },
    '& .MuiSlider-track': {
        //opacity: 1,
        backgroundColor: 'green',
        border: 'solid',
        borderColor: 'black',
        height: '10px',
        borderRadius: 0
    },
    '& .MuiSlider-rail': {
        border: 'solid',
        opacity: 1,
        //width: '10px',
        height: '10px',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 0
    }
}));

export default HPSlider;