/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import { Box } from '@mui/material';
import React from 'react';
import ErrorBoundary from '../../components/error_boundary';
import PropTypes from 'prop-types';

NathanEats.propTypes = {
    error: PropTypes.func.isRequired,
};

/*
Canvas.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
};*/
const Canvas = (props) => {
    const canvasRef = React.useRef(null);
    // const location = { 'width': props.width / 2, 'height': props.height / 2 };

    const [location, setLocation] = React.useState({ 'width': props.width / 2, 'height': props.height / 2 });
    const speed = 1;
    const radius = 5;
    const tail = radius * 2;
    const directionDegrees = React.useRef(350);
    const tailEndDirection = directionDegrees.current - 180 - 90;
    const dx = Math.cos(directionDegrees.current) * speed;
    const dy = Math.sin(directionDegrees.current) * speed;
    const tailDx = Math.cos(tailEndDirection) * tail;
    const tailDy = Math.sin(tailEndDirection) * tail;
    const clamp = (num, max) => Math.min(Math.max(num, 0), max);

    const draw = (context) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = 'blue';
        context.beginPath();
        context.ellipse(location.width, location.height, radius, radius, 0, 0, 2 * Math.PI);
        context.fill();
        context.strokeStyle = context.fillStyle;
        context.moveTo(location.width, location.height);
        context.lineTo(location.width - tailDx, location.height - tailDy);
        context.stroke();
        setLocation({ 'width': clamp(location.width + dx, props.width), 'height': clamp(location.height + dy, props.height) });
        directionDegrees.current = directionDegrees.current + (Math.random() - 0.5);
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const id = setInterval(draw, 50, context);
        return () => {
            clearInterval(id);
        };
    }, [location]);
    return <canvas ref={canvasRef} {...props} />;
};

export default function NathanEats(props) {
    console.log('NathanEats::props = ', props);
    return (<ErrorBoundary onError={props.error}>
        <Box>
            <Canvas width="200" height="200" style={{
                outline: 'black 3px solid',
            }} />
        </Box>
    </ErrorBoundary>);
}
