import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader, Tooltip } from '@mui/material';




export default function ResultCard(props) {

    const [pokemonDetails, setPokemonDetails] = React.useState();
    const [speciesDetails, setSpeciesDetails] = React.useState();

    React.useEffect(() => {
        console.log("ResultCard::useEffect");

        props.api.getPokemonByName(props.selectedPokemon).then(pokemon => {
            setPokemonDetails(pokemon);
        }).catch(err => {
            console.log(err);
            setPokemonDetails(null);
        });

        props.api.getPokemonSpeciesByName(props.selectedPokemon).then(pokemon => {
            setSpeciesDetails(pokemon);
        }).catch(err => {
            console.log(err);
            setSpeciesDetails(null);
        });

    }, [props.selectedPokemon]);

    let sprite;
    let generationSprites;
    let tooltip;
    if (pokemonDetails) {
        generationSprites = Object.entries(pokemonDetails?.sprites.versions[props.selectedGeneration]);
    }
    if (generationSprites) {
        sprite = generationSprites[0][1].front_default;
        tooltip = `${props.selectedGeneration} ${props.selectedPokemon}`
        if (!sprite) {
            console.log("There are NO generation sprites for this (" + props.selectedPokemon + "," + props.selectedGeneration + "), so using default");
            sprite = pokemonDetails?.sprites.front_default;
            tooltip = `There are no ${props.selectedGeneration} sprites for ${props.selectedPokemon} so this is just the default one`
        }
    }
    if (!sprite) {
        sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
        tooltip = `There are no sprite available for ${props.selectedPokemon}, so this is a default one`
    }

    return (<Card sx={{
        width: '100', display: 'flex'
    }} >
        <CardHeader
            title={props.selectedPokemon}
        />
        <Tooltip title={tooltip}>
            <CardMedia
                component="img"
                height={100}
                image={sprite}
                alt={props.selectedPokemon}
                sx={{ width: 100 }}
            />
        </Tooltip>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography>{props.selectedPokemon}</Typography>
                <Typography>{props.selectedGeneration}</Typography>
                <Typography>{props.selectedAilment}</Typography>
            </CardContent>
        </Box>
    </Card >);
}