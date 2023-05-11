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
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import 'datejs';
import HotelIcon from '@mui/icons-material/Hotel';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import FlightIcon from '@mui/icons-material/Flight';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ParkIcon from '@mui/icons-material/Park';
StayIcon.propTypes = {
    method: PropTypes.string,
};
function StayIcon(props) {
    const method = props.method || 'unknown';
    if (method.toLowerCase() === 'city') {
        return (<LocationCityIcon />);
    } else if (method.toLowerCase() == 'park') {
        return (<ParkIcon />);
    } else {
        return (<HotelIcon />);
    }
}
TravelIcon.propTypes = {
    method: PropTypes.string,
};
function TravelIcon(props) {
    const method = props.method || 'drive';
    if (method.toLowerCase() === 'drive') {
        return (<DriveEtaIcon />);
    } else if (method.toLowerCase() == 'flight') {
        return (<FlightIcon />);
    } else {
        return (<DriveEtaIcon />);
    }
}
TimelineStay.propTypes = {
    activeCallback: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    activeIdx: PropTypes.number.isRequired,
    location: PropTypes.string,
    name: PropTypes.string.isRequired,
    dates: PropTypes.arrayOf(PropTypes.string).isRequired,
};
function TimelineStay(props) {
    return (<TimelineItem >
        <TimelineSeparator>
            <TimelineDot onClick={() => props.activeCallback(props.idx)} sx={{
                background: props.activeIdx == props.idx ? 'green' : null,
            }} >
                <StayIcon method={props.location} />
            </TimelineDot>
            <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent onClick={() => props.activeCallback(props.idx)}>
            <Typography variant="h6">{props.name}</Typography>
            {props.dates.map((date, idx) => {
                const d = Date.parse(date).toString('dddd dS MMMM');
                return <Typography key={idx}>{d}</Typography>;
            })}

        </TimelineContent>
    </TimelineItem>);
}
TimelineTravel.propTypes = {
    method: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
};
function TimelineTravel(props) {
    return (
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography>Estimated {props.method} Time</Typography>
                <Typography>{props.time}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot>
                    <TravelIcon method={props.method} />
                </TimelineDot>
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent />
        </TimelineItem>
    );
}

CustomizedTimeline.propTypes = {
    items: PropTypes.array.isRequired,
    activeidx: PropTypes.number.isRequired,
    activeCallback: PropTypes.func.isRequired,
};
function CustomizedTimeline(props) {
    const { items, activeidx, activeCallback } = props;
    return (
        <Timeline position='left'>
            {
                items.map((item, idx) => {
                    if (item.type === 'stay') {
                        return <TimelineStay
                            key={idx}
                            idx={idx}
                            name={item.name}
                            activeIdx={activeidx}
                            activeCallback={activeCallback}
                            dates={item.dates}
                            location={item.location} />;
                    } else if (item.type === 'travel') {
                        return (<TimelineTravel key={idx} method={item.method} time={item.time} />);
                    }
                })
            }

        </Timeline>
    );
}

const ITINERARY = [
    { type: 'travel', time: '10hr', method: 'Flight' },
    {
        type: 'stay', name: 'Seattle', lat: 47.608013, lon: -122.335167, dates: ['23-may-23', '24-may-23'],
        location: 'city',
    },
    {
        type: 'stay', name: 'Port Angeles', lat: 48.062938, lon: -123.806223, dates: ['25-may-23'],
        location: 'park',
    },
    { type: 'stay', name: 'Quinault', lat: 47.469124, lon: -123.847559, dates: ['26-may-23'] },
    { type: 'stay', name: 'Ashford', lat: 46.75073479266735, lon: -121.81330747669331, dates: ['27-may-23'] },
    { type: 'stay', name: 'Portland', lat: 45.500773, lon: -122.677754, dates: ['28-may-23', '29-may-23'] },
    { type: 'stay', name: 'Cannon Beach', lat: 45.891172491693524, lon: -123.96089452891026, dates: ['30-may-23'] },
    { type: 'stay', name: 'Florence', lat: 43.98263034796129, lon: -124.1013473582618, dates: ['31-may-23'] },
    { type: 'stay', name: 'Crater Lake', lat: 42.910092820981276, lon: -122.14088068662235, dates: ['1-june-23'] },
    {
        type: 'stay',
        name: 'Redwood National Park', lat: 40.781411227060424, lon: -124.15628537685521, dates: ['2-june-23'],
    },
    { type: 'stay', name: 'Sonoma Valley', lat: 38.445747676577696, lon: -122.7238031565213, dates: ['3-june-23'] },
    {
        type: 'stay',
        name: 'San Francisco', lat: 37.78508584222342, lon: -122.40800528676782, dates: ['4-june-23', '5-june-23'],
    },
    {
        type: 'stay', name: 'Yosemite National Park', lat: 37.47335245975952, lon: -119.6349620399403,
        dates: ['6-june-23', '7-june-23'],
    },
    {
        type: 'stay',
        name: 'Sequoia National Park', lat: 36.60971295105597, lon: -118.7520952886471, dates: ['8-june-23'],
    },
    { type: 'stay', name: 'Lone Pine', lat: 36.593905259730114, lon: -118.05663889900185, dates: ['9-june-23'] },
    {
        type: 'stay',
        name: 'Las Vegas', lat: 36.106139199010705, lon: -115.1678137145338, dates: ['10-june-23', '11-june-23'],
    },
    { type: 'travel', time: '10hr', method: 'Flight' },

];

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function TabPanel(props) {
    const hidden = props.value !== props.index;
    return (
        <div hidden={hidden}>
            {!hidden && (
                <Box sx={{ p: 3 }}>
                    {props.children}
                </Box>
            )}
        </div>
    );
}


RoadTrip.propTypes = {
    info: PropTypes.func.isRequired,
    error: PropTypes.func.isRequired,
};

function calculateCenter(lats, lons) {
    const sortedLats = lats.toSorted();
    const sortedLons = lons.toSorted();
    const midLat = ((sortedLats.at(-1) - sortedLats.at(0)) / 2) + sortedLats.at(0);
    const midLon = ((sortedLons.at(-1) - sortedLons.at(0)) / 2) + sortedLons.at(0);
    return [midLat, midLon];
}

export default function RoadTrip(props) {
    const [active, setActive] = React.useState(0);
    const [value, setValue] = React.useState(0);
    console.log('Active is ', active);
    const center = React.useRef(calculateCenter(ITINERARY.filter((item) => item.type === 'stay').map((loc) => {
        return loc.lat;
    }), ITINERARY.filter((item) => item.type === 'stay').map((loc) => {
        return loc.lon;
    })));
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
            <CustomizedTimeline items={ITINERARY} activeidx={active} activeCallback={(idx) => {
                setActive(idx);
            }
            } />
        </TabPanel>
        <TabPanel value={value} index={1}>
            < Map center={center.current}
                locations={ITINERARY.map((item, idx) => {
                    return { data: item, idx: idx };
                }).filter((item) => item.data.type === 'stay')}
                active={active}
                onSelect={(idx) => {
                    setActive(idx);
                }} />
        </TabPanel>
    </Box>;
}
