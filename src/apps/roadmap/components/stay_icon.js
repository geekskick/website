import React from 'react';
import PropTypes from 'prop-types';
import HotelIcon from '@mui/icons-material/Hotel';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ParkIcon from '@mui/icons-material/Park';
StayIcon.propTypes = {
    method: PropTypes.string,
};
export default function StayIcon(props) {
    const method = props.method || 'unknown';
    if (method.toLowerCase() === 'city') {
        return (<LocationCityIcon />);
    } else if (method.toLowerCase() == 'park') {
        return (<ParkIcon />);
    } else {
        return (<HotelIcon />);
    }
}
