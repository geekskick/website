import React from 'react';
import PropTypes from 'prop-types';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import 'datejs';
import StayIcon from './stay_icon';

TimelineStay.propTypes = {
    activeCallback: PropTypes.func.isRequired,
    idx: PropTypes.number.isRequired,
    activeIdx: PropTypes.number.isRequired,
    location: PropTypes.string,
    name: PropTypes.string.isRequired,
    dates: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default function TimelineStay(props) {
    const active = props.activeIdx == props.idx;
    return (<TimelineItem >
        <TimelineSeparator>
            <TimelineDot onClick={() => props.activeCallback(props.idx)} sx={{
                background: active ? 'green' : null,
            }} >
                <StayIcon method={props.location} />
            </TimelineDot>
            <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent onClick={() => props.activeCallback(props.idx)}>
            <Typography variant="h5">{props.name}</Typography>
            {props.dates.map((date, idx) => {
                const d = Date.parse(date).toString('dddd dS MMMM');
                return <Typography key={idx}>{d}</Typography>;
            })}
            <Typography hidden={!active}>Highlighted in Map tab</Typography>
        </TimelineContent>
    </TimelineItem>);
}
