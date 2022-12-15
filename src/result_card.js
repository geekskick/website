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

    const [pokemonDetails, setPokemonDetails] = React.useState();
    const [speciesDetails, setSpeciesDetails] = React.useState();

    const pokemonSpeciesLoader = async (pokemon, callback) => {
        const species = await props.api.getPokemonSpeciesByName(pokemon.split("_")[0]);
        console.log("Details for ", pokemon, species);
        callback(pokemon, species);

    }

    const pokemonDetailsLoader = async (pokemon, callback) => {
        const species = await props.api.getPokemonByName(pokemon.split("_")[0]);
        console.log("Details for ", pokemon, species);
        callback(pokemon, species);
    }

    React.useEffect(() => {
        console.log("ResultCard::useEffect");
        getOrUseCachedPokemonData(props.selectedPokemon, pokemonDetailsLoader, (data) => {
            console.log("Got ", data);
            setPokemonDetails(data);
        });
        getOrUseCachedSpeciesData(props.selectedPokemon, pokemonSpeciesLoader, (data) => { setSpeciesDetails(data) });
    }, [props.selectedPokemon]);

    console.log("ResultCard props = ", props);
    console.log("SpeciesData = ", speciesDetails);
    console.log("PokemonData = ", pokemonDetails);
    return (<Card sx={{ maxWidth: 400 }}>
        <CardHeader
            title={props.selectedPokemon}
        />
        <CardMedia
            component="img"
            height="150"
            image={pokemonDetails?.sprites?.front_default}
            alt={props.selectedPokemon}
        />
        <CardContent>
            <Typography>{props.selectedPokemon}</Typography>
            <Typography>{props.selectedGeneration}</Typography>
            <Typography>{props.selectedAilment}</Typography>
        </CardContent>
    </Card>);
}