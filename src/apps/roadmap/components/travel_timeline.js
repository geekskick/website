import React from 'react';
import PropTypes from 'prop-types';

import Timeline from '@mui/lab/Timeline';
import TimelineStay from './timeline_stay';
import TimelineTravel from './timeline_travel';

TravelTimeline.propTypes = {
    items: PropTypes.array.isRequired,
    activeidx: PropTypes.number.isRequired,
    activeCallback: PropTypes.func.isRequired,
};
export default function TravelTimeline(props) {
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
