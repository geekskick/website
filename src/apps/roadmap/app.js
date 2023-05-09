/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import Map from './map';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
// import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
// import FastfoodIcon from '@mui/icons-material/Fastfood';
// import LaptopMacIcon from '@mui/icons-material/LaptopMac';
// import HotelIcon from '@mui/icons-material/Hotel';
// import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
RoadTrip.propTypes = {
    info: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
};

function customizedTimeline(items, activeidx, activeCallback) {
    console.log(activeidx);
    // items[activeidx].scrollIntoView();
    return (
        <Timeline position="left">
            {
                items.map((item, idx) => {
                    return (<TimelineItem key={idx} >
                        <TimelineSeparator>
                            <TimelineDot onClick={() => activeCallback(idx)} sx={{
                                background: activeidx == idx ? 'green' : null,
                            }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent onClick={() => activeCallback(idx)}>
                            <Typography>{item.name}</Typography></TimelineContent>
                    </TimelineItem>);
                })
            }
        </Timeline>
    );
}

const LOCATIONS = [
    { name: 'Seattle', lat: 47.608013, lon: -122.335167 },
    { name: 'Port Angeles', lat: 48.062938, lon: -123.806223 },
    { name: 'Quinault', lat: 47.469124, lon: -123.847559 },
    { name: 'Ashford', lat: 46.75073479266735, lon: -121.81330747669331 },
    { name: 'Portland', lat: 45.500773, lon: -122.677754 },
    { name: 'Cannon Beach', lat: 45.891172491693524, lon: -123.96089452891026 },
    { name: 'Florence', lat: 43.98263034796129, lon: -124.1013473582618 },
    { name: 'Crater Lake', lat: 42.910092820981276, lon: -122.14088068662235 },
    { name: 'Redwood National Park', lat: 40.781411227060424, lon: -124.15628537685521 },
    { name: 'Sonoma Valley', lat: 38.445747676577696, lon: -122.7238031565213 },
    { name: 'San Francisco', lat: 37.78508584222342, lon: -122.40800528676782 },
    { name: 'Yosemite National Park', lat: 37.47335245975952, lon: -119.6349620399403 },
    { name: 'Sequoia National Park', lat: 36.60971295105597, lon: -118.7520952886471 },
    { name: 'Lone Pine', lat: 36.593905259730114, lon: -118.05663889900185 },
    { name: 'Las Vegas', lat: 36.106139199010705, lon: -115.1678137145338 },
];

export default function RoadTrip(props) {
    console.log('RoadTrip');
    const [active, setActive] = React.useState(0);
    return (
        <Stack direction="row"><div style={{ overflowY: 'auto' }}>{
            customizedTimeline(LOCATIONS, active, (idx) => {
                setActive(idx);
            })
        }</div>
            <Map locations={LOCATIONS} active={active} onSelect={(idx) => {
                setActive(idx);
            }} />
        </Stack>);
}
