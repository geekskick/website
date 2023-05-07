import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { Icon } from 'leaflet';

Map.propTypes = {
    locations: PropTypes.array.isRequired,
};

const MyIcon = new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] });

export default function Map(props) {
    console.log(`map ${props}`);
    return <MapContainer
        className="map"
        center={[42.910092820981276, -122.14088068662235]}
        zoom={5}
        scrollWheelZoom={true}
        style={{
            width: '100%',
            height: '80vh',
            zIndex: '1',
        }}
    >
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>
            contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
            props.locations.map((loc) => {
                return <Marker icon={MyIcon} key={loc.name} position={[loc.lat, loc.lon]}>
                    <Popup>{loc.name}</Popup>
                </Marker>;
            })
        }
    </MapContainer>;
}
