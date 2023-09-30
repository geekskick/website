import React from 'react';
import PropTypes from 'prop-types';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

TravelIcon.propTypes = {
    method: PropTypes.string,
};
export default function TravelIcon(props) {
    const method = props.method || 'drive';
    if (method.toLowerCase() === 'drive') {
        return (<DriveEtaIcon />);
    } else if (method.toLowerCase() == 'flight') {
        return (<FlightIcon />);
    } else if (method.toLowerCase() == 'boat') {
        return (<DirectionsBoatIcon />);
    } else {
        return (<DriveEtaIcon />);
    }
}
