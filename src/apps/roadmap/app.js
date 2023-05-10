/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import Map from './map';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
// import FastfoodIcon from '@mui/icons-material/Fastfood';
// import LaptopMacIcon from '@mui/icons-material/LaptopMac';
// import HotelIcon from '@mui/icons-material/Hotel';
// import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import { Stack } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import 'datejs';

RoadTrip.propTypes = {
    info: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
};

function customizedTimeline(items, activeidx, activeCallback) {
    console.log(activeidx);
    return (
        <Timeline position='left'>
            {
                items.map((item, idx) => {
                    return (<TimelineItem key={idx} >
                        <TimelineOppositeContent onClick={() => activeCallback(idx)}>
                            {item.dates.map((date, idx) => {
                                console.log(date);
                                const d = Date.parse(date);
                                const d2 = d.toString('dddd dS MMMM');
                                return <Typography key={idx}>{d2}</Typography>;
                            })}
                        </TimelineOppositeContent>
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
    { name: 'Seattle', lat: 47.608013, lon: -122.335167, dates: ['23-may-23', '24-may-23'] },
    { name: 'Port Angeles', lat: 48.062938, lon: -123.806223, dates: ['25-may-23'] },
    { name: 'Quinault', lat: 47.469124, lon: -123.847559, dates: ['26-may-23'] },
    { name: 'Ashford', lat: 46.75073479266735, lon: -121.81330747669331, dates: ['27-may-23'] },
    { name: 'Portland', lat: 45.500773, lon: -122.677754, dates: ['28-may-23', '29-may-23'] },
    { name: 'Cannon Beach', lat: 45.891172491693524, lon: -123.96089452891026, dates: ['30-may-23'] },
    { name: 'Florence', lat: 43.98263034796129, lon: -124.1013473582618, dates: ['31-may-23'] },
    { name: 'Crater Lake', lat: 42.910092820981276, lon: -122.14088068662235, dates: ['1-june-23'] },
    { name: 'Redwood National Park', lat: 40.781411227060424, lon: -124.15628537685521, dates: ['2-june-23'] },
    { name: 'Sonoma Valley', lat: 38.445747676577696, lon: -122.7238031565213, dates: ['3-june-23'] },
    { name: 'San Francisco', lat: 37.78508584222342, lon: -122.40800528676782, dates: ['4-june-23', '5-june-23'] },
    {
        name: 'Yosemite National Park', lat: 37.47335245975952, lon: -119.6349620399403,
        dates: ['6-june-23', '7-june-23'],
    },
    { name: 'Sequoia National Park', lat: 36.60971295105597, lon: -118.7520952886471, dates: ['8-june-23'] },
    { name: 'Lone Pine', lat: 36.593905259730114, lon: -118.05663889900185, dates: ['9-june-23'] },
    { name: 'Las Vegas', lat: 36.106139199010705, lon: -115.1678137145338, dates: ['10-june-23', '11-june-23'] },
];

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    console.log(`Tabpanel[${index}] value `, value);
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}
export default function RoadTrip(props) {
    console.log('RoadTrip');
    const [active, setActive] = React.useState(0);
    const [value, setValue] = React.useState(0);
    console.log('Value ', value);
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
            {customizedTimeline(LOCATIONS, active, (idx) => {
                setActive(idx);
            })}
        </TabPanel>
        <TabPanel value={value} index={1}>
            < Map locations={LOCATIONS} active={active} onSelect={(idx) => {
                setActive(idx);
            }} />
        </TabPanel>
    </Box>;
    /* return (
        <Stack direction="row"><Box sx={{
            minWidth: '300px',
        }}>{
                customizedTimeline(LOCATIONS, active, (idx) => {
                    setActive(idx);
                })} </Box>
            < Map locations={LOCATIONS} active={active} onSelect={(idx) => {
                setActive(idx);
            }} />
        </Stack>);*/
}
