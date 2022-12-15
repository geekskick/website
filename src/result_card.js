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
        try {
            const species = await props.api.getPokemonSpeciesByName(pokemon.split("_")[0]);
            console.log("Details for ", pokemon, species);
            callback(pokemon, species);
        }
        catch (error) {
            console.log(error);
            callback(pokemon, null);
        }

    }

    const pokemonDetailsLoader = async (pokemon, callback) => {
        try {
            const species = await props.api.getPokemonByName(pokemon.split("_")[0]);
            console.log("Details for ", pokemon, species);
            callback(pokemon, species);
        }
        catch (error) {
            console.log(error);
            callback(pokemon, null);
        }
    }

    React.useEffect(() => {
        console.log("ResultCard::useEffect");
        getOrUseCachedPokemonData(props.selectedPokemon, pokemonDetailsLoader, (data) => {
            console.log("Got ", data);
            setPokemonDetails(data);
        });
        getOrUseCachedSpeciesData(props.selectedPokemon, pokemonSpeciesLoader, (data) => { setSpeciesDetails(data) });
    }, [props.selectedPokemon]);

    let sprite;
    let generationSprites;
    if (pokemonDetails) {
        generationSprites = Object.entries(pokemonDetails?.sprites.versions[props.selectedGeneration]);
    }
    if (generationSprites) {
        sprite = generationSprites[0][1].front_default;
        if (!sprite) {
            console.log("There are NO generation sprites for this (" + props.selectedPokemon + "," + props.selectedGeneration + "), so using default");
            sprite = pokemonDetails?.sprites.front_default;
        }
    }
    if (!sprite) {
        sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
    }

    console.log("ResultCard props = ", props);
    console.log("SpeciesData = ", speciesDetails);
    console.log("PokemonData = ", pokemonDetails);
    console.log("Generation sprites = ", generationSprites);
    console.log("Selected sprite = ", sprite);

    return (<Card sx={{
        width: '100', display: 'flex'
    }} >
        <CardHeader
            title={props.selectedPokemon}
        />
        <CardMedia
            component="img"
            height={100}
            image={sprite}
            alt={props.selectedPokemon}
            sx={{ width: 100 }}

        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography>{props.selectedPokemon}</Typography>
                <Typography>{props.selectedGeneration}</Typography>
                <Typography>{props.selectedAilment}</Typography>
            </CardContent>
        </Box>
    </Card >);
}