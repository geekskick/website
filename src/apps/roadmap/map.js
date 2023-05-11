import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconGrey from './dist/grey-marker-icon.png';
import markerIconGreen from './dist/green-marker-icon.png';

import { Icon } from 'leaflet';

Map.propTypes = {
    locations: PropTypes.array.isRequired,
    active: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
};

export default function Map(props) {
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

    return <MapContainer
        className="map"
        center={props.center}
        zoom={5}
        scrollWheelZoom={true}
        style={{
            width: '100%',
            height: '70vh',
            zIndex: '1',
        }}
    >
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
            contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            props.locations.map((loc, idx) => {
                return <Marker icon={idx == props.active ? GREEN_ICON : GREY_ICON}
                    key={idx}
                    position={[loc.lat, loc.lon]}
                    eventHandlers={{
                        click: () => {
                            props.onSelect(idx);
                        },
                    }}
                />;
            })
        }
    </MapContainer>;
}
