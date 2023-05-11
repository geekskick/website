import React from 'react';
import PropTypes from 'prop-types';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import TravelIcon from './/travel_icon';

TimelineTravel.propTypes = {
    method: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
};
export default function TimelineTravel(props) {
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
