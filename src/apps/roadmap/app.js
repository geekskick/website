import React from 'react';
import PropTypes from 'prop-types';
import Map from './map';

RoadTrip.propTypes = {
    info: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
};


const LOCATIONS = [
    { name: '1', lat: 47.608013, lon: -122.335167 },
    { name: '2', lat: 48.062938, lon: -123.806223 },
    { name: '3', lat: 47.469124, lon: -123.847559 },
    { name: '4', lat: 46.75073479266735, lon: -121.81330747669331 },
    { name: '5', lat: 45.500773, lon: -122.677754 },
    { name: '6', lat: 45.891172491693524, lon: -123.96089452891026 },
    { name: '7', lat: 43.98263034796129, lon: -124.1013473582618 },
    { name: '8', lat: 42.910092820981276, lon: -122.14088068662235 },
    { name: '9', lat: 40.781411227060424, lon: -124.15628537685521 },
    { name: '10', lat: 38.445747676577696, lon: -122.7238031565213 },
    { name: '11', lat: 37.78508584222342, lon: -122.40800528676782 },
    { name: '12', lat: 37.47335245975952, lon: -119.6349620399403 },
    { name: '13', lat: 36.60971295105597, lon: -118.7520952886471 },
    { name: '14', lat: 36.593905259730114, lon: -118.05663889900185 },
    { name: '15', lat: 36.106139199010705, lon: -115.1678137145338 },

];

export default function RoadTrip(props) {
    console.log('RoadTrip');
    return <Map locations={LOCATIONS} />;
}
