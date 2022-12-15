import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';
import { getOrUseCachedPokemonData, getOrUseCachedSpeciesData } from './get_or_use_cached';

export default function ResultCard(props) {
    console.log("ResultCard props = ", props);
    const speciesData = getOrUseCachedSpeciesData(props.selectedPokemon, props.pokemonSpeciesCacheHandler);
    const pokemonData = getOrUseCachedPokemonData(props.selectedPokemon, props.pokemonDetailsCacheHandler);
    const sprite = "hello";
    console.log(speciesData);
    console.log(pokemonData);
    return (<Card sx={{ maxWidth: 400 }}>
        <CardHeader
            title={props.selectedPokemon}
        />
        <CardMedia
            component="img"
            height="150"
            image={pokemonData.sprites.front_default}
            alt={props.selectedPokemon}
        />
        <CardContent>
            <Typography>{props.selectedPokemon}</Typography>
            <Typography>{props.selectedGeneration}</Typography>
            <Typography>{props.selectedAilment}</Typography>
        </CardContent>
    </Card>);
}