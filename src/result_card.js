import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';

export default function ResultCard(props) {
    console.log("ResultCard props = ", props);
    const sprite = "";
    return (<Card>
        <CardHeader
            title={props.selectedPokemon}
        />
        <CardMedia
            component="img"
            height="194"
            image={sprite}
            alt={props.selectedPokemon}
        />
        <CardContent>
            <Typography>{props.selectedPokemon}</Typography>
            <Typography>{props.selectedGeneration}</Typography>
            <Typography>{props.selectedAilment}</Typography>
        </CardContent>
    </Card>);
}