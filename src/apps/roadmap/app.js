import React from 'react';
import PropTypes from 'prop-types';
import Map from './components/map';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TravelTimeline from './components/travel_timeline';
import TabPanel from './components/tab_panel';
import ITINERARY from './plan.json';


RoadTrip.propTypes = {
    info: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
};

function calculateCenter(lats, lons) {
    lats.sort();
    lons.sort();
    const midLat = ((lats.at(-1) - lats.at(0)) / 2) + lats.at(0);
    const midLon = ((lons.at(-1) - lons.at(0)) / 2) + lons.at(0);
    return [midLat, midLon];
}

export default function RoadTrip(props) {
    const [active, setActive] = React.useState(0);
    const [value, setValue] = React.useState(0);
    const itinerary = ITINERARY.plan;

    console.log('Active is ', active);
    const stays = React.useRef(itinerary.filter((item) => item.type === 'stay'));
    const lats = React.useRef(stays.current.map((loc) => {
        return loc.lat;
    }));
    const lons = React.useRef(stays.current.map((loc) => {
        return loc.lon;
    }));
    console.log(`Lats = `, lats, ' Lons = ', lons);
    const center = React.useRef(calculateCenter(lats.current, lons.current));
    return <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value}
                variant="fullWidth"
                onChange={(_, newValue) => {
                    setValue(newValue);
                }}>
                <Tab label="Timeline" />
                <Tab label="Map" />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            <TravelTimeline items={itinerary} activeidx={active} activeCallback={(idx) => {
                setActive(idx);
            }
            } />
        </TabPanel>
        <TabPanel value={value} index={1}>
            < Map center={center.current}
                locations={itinerary.map((item, idx) => {
                    return { data: item, idx: idx };
                }).filter((item) => item.data.type === 'stay')}
                active={active}
                onSelect={(idx) => {
                    setActive(idx);
                }} />
        </TabPanel>
    </Box>;
}
