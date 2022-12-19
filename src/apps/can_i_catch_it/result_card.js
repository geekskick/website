import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography, Tooltip, CircularProgress } from '@mui/material';
import HPSlider from './hp_slider';
import InputSlider from './level_slider';
import CONFIGURATION from './config.js';
import BallOptions from './ball_options'
import { styled } from '@mui/material/styles';
const Item = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    borderColor: 'pink',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

export default function ResultCard(props) {

    console.log("Result card props = ", props);
    const [pokemonDetails, setPokemonDetails] = React.useState();
    const [speciesDetails, setSpeciesDetails] = React.useState();
    const [level, setLevel] = React.useState(50);
    const [hp, setHp] = React.useState(1.0);

    const levelChangeHandler = (value) => {
        console.log("ResultCard::levelChangeHandler", value);
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
            console.log("ResultCard::fetchedPokemon = ", pokemon);
            setPokemonDetails(pokemon);
        }).catch(err => {
            console.log("ResultCard::fetchedPokemon::error =", err);
            setPokemonDetails(null);
            props.onError(`Failed to get the details for ${props.selectedPokemon}: ${err}`);
        });

        props.api.getPokemonSpeciesByName(props.selectedPokemon).then(pokemon => {
            console.log("ResultCard::fetchedSpecies = ", pokemon);
            setSpeciesDetails(pokemon);
        }).catch(err => {
            console.log("ResultCard::fetchedSpecies::error =", err);
            props.onError(`Failed to get the species details for ${props.selectedPokemon}: ${err}`);
            setSpeciesDetails(null);
        });

    }, [props.selectedPokemon]);

    let sprite;
    let generationSprites;
    let tooltip = "tooltip";
    console.log("ResultCard::pokemonDetails = ", pokemonDetails);
    console.log("ResultCard::speciesDetails = ", speciesDetails);
    if (pokemonDetails) {
        generationSprites = Object.entries(pokemonDetails?.sprites.versions[props.selectedGeneration]);
        console.log("ResultCard::generationSprites = ", generationSprites);
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

    const spriteDisplay = (() => {
        console.log(`ResultCard::${pokemonDetails?.species.name} === ${speciesDetails?.name} === ${props.selectedPokemon}`);
        if (!(speciesDetails?.name === props.selectedPokemon &&
            pokemonDetails?.species.name === props.selectedPokemon)) {
            return <CircularProgress />
        }
        else {
            return (<Tooltip title={tooltip}>
                <Box
                    component="img"
                    //height={100}
                    src={sprite}
                    alt={props.selectedPokemon}
                    sx={{
                        width: '200px',
                        height: '200px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        objectFit: 'contain'
                    }}
                />
            </Tooltip>);
        }
    })();
    // TODO: What about if the thing isn't catchable?
    return (<Card sx={{
        width: '100',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }} >
        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '90%'
            }}>
            <Item>
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: 'lightcoral',
                    }}>
                    <Item>
                        <Typography variant="h3">{props.selectedPokemon}</Typography>
                    </Item>
                    <Item>
                        {spriteDisplay}
                    </Item>
                    <Item>
                        <HPSlider
                            valueLabelDisplay='on'
                            valueLabelFormat={(x) => `${x}% HP`}
                            defaultValue={hp * 100}
                            min={1}
                            max={100}
                            onChangeCommitted={hpChangeHandler}
                        />
                    </Item>
                    <Item>
                        <InputSlider
                            value={level}
                            onChange={levelChangeHandler}
                        />
                    </Item>

                </Stack>
            </Item>
            <Item>
                <BallOptions
                    selectedGeneration={props.selectedGeneration}
                    selectedPokemon={pokemonDetails?.name}
                    speciesDetails={speciesDetails}
                    api={props.api}
                    pokemonLevel={level}
                    hp={hp}
                    pokemonDetails={pokemonDetails} />
            </Item>
        </Stack >
    </Card >);
}