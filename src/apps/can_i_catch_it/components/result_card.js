import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Typography, Tooltip, CircularProgress } from '@mui/material';
import HPSlider from './hp_slider';
import InputSlider from './level_slider';
import CONFIGURATION from '../config.js';
import BallOptions from './ball_options';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const Item = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    borderColor: 'pink',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

ResultCard.propTypes = {
    api: PropTypes.object.isRequired,
    selectedPokemon: PropTypes.string.isRequired,
    selectedGeneration: PropTypes.string.isRequired,
    onError: PropTypes.func.isRequired,
};

export default function ResultCard(props) {
    console.log('Result card props = ', props);
    const [pokemonDetails, setPokemonDetails] = React.useState();
    const [speciesDetails, setSpeciesDetails] = React.useState();
    const [level, setLevel] = React.useState(50);
    const [hp, setHp] = React.useState(1.0);

    const levelChangeHandler = (event, value) => {
        console.log('ResultCard::levelChangeHandler', event, value);
        setLevel(value);
    };

    const hpChangeHandler = (event, value) => {
        console.log('ResultCard::hpChangeHandler', event, value);
        const percent = value / 100.0;
        console.log('percent = ', percent);
        setHp(percent);
    };

    const getGenerationSprites = (pokemonDetails, selectedGeneration) => {
        let generationSprites = null;
        try {
            generationSprites = Object.entries(pokemonDetails?.sprites.versions[selectedGeneration]);
        } catch {
        }
        console.log('ResultCard::generationSprites = ', generationSprites);
        return generationSprites;
    };

    React.useEffect(() => {
        console.log('ResultCard::useEffect');
        props.api.getPokemonByName(props.selectedPokemon).then((pokemon) => {
            console.log('ResultCard::fetchedPokemon = ', pokemon);
            setPokemonDetails(pokemon);
        }).catch((err) => {
            console.log('ResultCard::fetchedPokemon::error =', err);
            setPokemonDetails(null);
            props.onError(`Failed to get the details for ${props.selectedPokemon}: ${err}`);
        });

        props.api.getPokemonSpeciesByName(props.selectedPokemon).then((pokemon) => {
            console.log('ResultCard::fetchedSpecies = ', pokemon);
            setSpeciesDetails(pokemon);
        }).catch((err) => {
            console.log('ResultCard::fetchedSpecies::error =', err);
            props.onError(`Failed to get the species details for ${props.selectedPokemon}: ${err}`);
            setSpeciesDetails(null);
        });
    }, [props]);

    class SpriteImage {
        constructor(url, tooltip) {
            this.url = url;
            this.tooltip = tooltip;
        }
    }

    const getSpriteImage = (generationSprites, pokemonDetails, selectedGeneration, selectedPokemon) => {
        const rc = new SpriteImage(null, null);
        /*
        There is a chance that the pokemon doesn't have a generation sprite, and it also doesn't have a default sprite.
        so here I use the priority order for getting the sprite:
            1 - the one for the generation
            2 - the default for the pokemon
            3 - the default one if no sprite at all
        This each time I try to set the SpriteImage url it might be null as a result, so this method feels a bit wierd.
        */
        if (generationSprites) {
            rc.url = generationSprites[0][1].front_default;
            rc.tooltip = `${props.selectedGeneration} ${props.selectedPokemon}`;
        }
        if (!rc.url) {
            console.log('There are NO generation sprites for this (' +
                selectedPokemon + ',' + selectedGeneration + '), so using default');
            rc.url = pokemonDetails?.sprites.front_default;
            rc.tooltip = `There are no ${selectedGeneration} sprites for 
            ${selectedPokemon} so this is just the default one`;
        }
        if (!rc.url) {
            rc.url = CONFIGURATION.DEFAULT_SPRITE_URL;
            rc.tooltop = `There are no sprite available for ${selectedPokemon}, so this is a default one`;
        }
        return rc;
    };

    console.log('ResultCard::pokemonDetails = ', pokemonDetails);
    console.log('ResultCard::speciesDetails = ', speciesDetails);
    const generationSprites = getGenerationSprites(pokemonDetails, props.selectedGeneration);
    const spriteImage = getSpriteImage(
        generationSprites,
        pokemonDetails,
        props.selectedGeneration,
        props.selectedPokemon);


    const spriteDisplay = (() => {
        console.log(`ResultCard::${pokemonDetails?.species.name}
         === ${speciesDetails?.name} === ${props.selectedPokemon}`);
        if (!(speciesDetails?.name === props.selectedPokemon &&
            pokemonDetails?.species.name === props.selectedPokemon)) {
            return <CircularProgress sx={{
                color: 'green',
            }} />;
        } else {
            return (<Tooltip title={spriteImage.tooltip}>
                <Box
                    component="img"
                    // height={100}
                    src={spriteImage.url}
                    alt={props.selectedPokemon}
                    sx={{
                        width: '200px',
                        height: '200px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        objectFit: 'contain',
                    }}
                />
            </Tooltip>);
        }
    })();
    return (
        <Card sx={{
            width: '100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        }} >
            <Stack

                spacing={10}
                sx={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    width: '100%',
                    flexDirection: { xs: 'column', md: 'row' },
                }}>
                <Item>
                    <Stack
                        sx={{
                            spacing: 2,
                            alignItems: 'space-evenly',
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
                                onChangeCommitted={levelChangeHandler}
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

        </Card >

    );
}
