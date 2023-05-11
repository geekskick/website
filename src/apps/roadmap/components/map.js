import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapIcon from './map_icon';

Map.propTypes = {
    locations: PropTypes.array.isRequired,
    active: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    center: PropTypes.arrayOf(PropTypes.number),
};

export default function Map(props) {
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
            props.locations.map((loc) => {
                return <MapIcon
                    key={loc.idx}
                    idx={loc.idx}
                    active={props.active}
                    lat={loc.data.lat}
                    lon={loc.data.lon}
                    onSelect={props.onSelect} />;
            })
        }
    </MapContainer>;
}
