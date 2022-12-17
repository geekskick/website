import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import HPSlider from './hp_slider';
import Slider from '@mui/material/Slider';
import CONFIGURATION from './config.js';
import BallOptions from './ball_options'

export default function ResultCard(props) {

    console.log("Result card props = ", props);
    const [pokemonDetails, setPokemonDetails] = React.useState();
    const [level, setLevel] = React.useState(50);
    const [hp, setHp] = React.useState(1.0);

    const levelChangeHandler = (event, value) => {
        console.log("ResultCard::levelChangeHandler", event, value);
        setLevel(value);
    };

    const hpChangeHandler = (event, value) => {
        console.log("ResultCard::hpChangeHandler", event, value);
        const percent = value / 100.0;
        console.log("percent = ", percent);
        setHp(percent);
    }

    React.useEffect(() => {
        console.log("ResultCard::useEffect");

        props.api.getPokemonByName(props.selectedPokemon).then(pokemon => {
            setPokemonDetails(pokemon);
        }).catch(err => {
            console.log(err);
            setPokemonDetails(null);
        });

    }, [props.selectedPokemon]);

    let sprite;
    let generationSprites;
    let tooltip = "tooltip";
    if (pokemonDetails) {
        generationSprites = Object.entries(pokemonDetails?.sprites.versions[props.selectedGeneration]);
    }
    if (generationSprites) {
        sprite = generationSprites[0][1].front_default;
        tooltip = `${props.selectedGeneration} ${props.selectedPokemon} `
        if (!sprite) {
            console.log("There are NO generation sprites for this (" + props.selectedPokemon + "," + props.selectedGeneration + "), so using default");
            sprite = pokemonDetails?.sprites.front_default;
            tooltip = `There are no ${props.selectedGeneration} sprites for ${props.selectedPokemon} so this is just the default one`
        }
    }
    if (!sprite) {
        sprite = CONFIGURATION.DEFAULT_SPRITE_URL;
        tooltip = `There are no sprite available for ${props.selectedPokemon}, so this is a default one`
    }

    return (<Card sx={{
        width: '100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }} >
        <CardHeader
            title={props.selectedPokemon}
        />
        <Box>
            <Tooltip title={tooltip}>
                <CardMedia
                    component="img"
                    height={100}
                    image={sprite}
                    alt={props.selectedPokemon}
                    sx={{ width: 100 }}
                />
            </Tooltip>
            <Tooltip title={"Select a HP level"}>
                <HPSlider
                    defaultValue={hp * 100}
                    min={1}
                    max={100}
                    onChangeCommitted={hpChangeHandler}
                />
            </Tooltip>
            <Tooltip title={"Select a the Pokemon's level"}>
                <Slider
                    defaultValue={level}
                    step={1}
                    min={1}
                    max={100}
                    onChangeCommitted={levelChangeHandler}
                />
            </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <BallOptions
                    selectedGeneration={props.selectedGeneration}
                    selectedPokemon={props.selectedPokemon}
                    api={props.api}
                    pokemonLevel={level}
                    hp={hp}
                    pokemonDetails={pokemonDetails} />
            </CardContent>
        </Box>
    </Card >);
}