import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconGrey from '../dist/grey-marker-icon.png';
import markerIconGreen from '../dist/green-marker-icon.png';

import { Icon } from 'leaflet';

MapIcon.propTypes = {
    active: PropTypes.number.isRequired,
    idx: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};
export default function MapIcon(props) {
    const GREEN_ICON = new Icon({
        iconSize: [25, 41], iconAnchor: [12, 41],
        iconUrl:
            markerIconGreen,
    });
    const GREY_ICON = new Icon({
        iconSize: [25, 41], iconAnchor: [12, 41],
        iconUrl:
            markerIconGrey,
    });
    const { active, idx, lat, lon, onSelect } = props;
    return <Marker icon={idx == active ? GREEN_ICON : GREY_ICON}
        key={idx}
        position={[lat, lon]}
        eventHandlers={{
            click: () => {
                onSelect(idx);
            },
        }}
    />;
}
