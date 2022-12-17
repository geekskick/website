import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import Slider from '@mui/material/Slider';
import CONFIGURATION from './config.js';
import { styled } from '@mui/material/styles';

import calculateCaptureProbability from './calculations.js';

const HPSlider = styled(Slider)(({ theme }) => ({
    height: 2,
    padding: '15px 0',
    // The dragger
    '& .MuiSlider-thumb': {
        backgroundColor: 'blue',
        //margin: '-18px 0 0',
        borderRadius: '50%',
        background: 'white',
        cursor: 'pointer',
        border: 0,
    },
    '& .MuiSlider-track': {
        //opacity: 1,
        backgroundColor: 'green',
        border: 'solid',
        borderColor: 'black',
        height: '10px',
        borderRadius: 0
    },
    '& .MuiSlider-rail': {
        border: 'solid',
        opacity: 1,
        //width: '10px',
        height: '10px',
        backgroundColor: 'white',
        borderColor: 'black',
        borderRadius: 0
    }
}));


function BallOptions(props) {

    const [ballList, setBallList] = React.useState([]);
    const [speciesDetails, setSpeciesDetails] = React.useState({});

    React.useEffect(() => {
        console.log("BallOptions::useEffect");
        props.api.getPokemonSpeciesByName(props.selectedPokemon).then(pokemon => {
            console.log(pokemon);
            setSpeciesDetails(pokemon);
        }).catch(err => {
            console.log(err);
            setSpeciesDetails(null);
        });


        props.api.getItemCategoryByName('standard-balls').then(ballType => {
            const balls = ballType.items.map(item => {
                return item.name;
            });
            console.log(balls);
            setBallList(balls);
        }).catch(err => {
            console.log(err);
        });
    }, [props.selectedPokemon]);

    console.log("speciedDetails = ", speciesDetails);
    const hpStat = props.pokemonDetails?.stats.filter(stat => stat.stat?.name === "hp")[0].base_stat;
    console.log(`${props.selectedPokemon} has a base hp stat of ${hpStat}`);
    return (
        <div>

            {
                ballList.map(ball => {
                    // Make the icon and the text on the same line - pulled from here:
                    // https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-mui
                    let probability;
                    try {
                        probability = calculateCaptureProbability(props.selectedGeneration, speciesDetails?.capture_rate, ball, hpStat, props.pokemonLevel, props.hp);
                        probability = Math.ceil(1.0 / probability);
                    }
                    catch (error) {
                        console.log(error);
                        probability = `Unable to calculate using ${props.selectedGeneration}`
                    }
                    return (
                        <Tooltip title={`${props.selectedPokemon} has a base capture rate of ${speciesDetails?.capture_rate} `}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 1,
                                    m: 1,
                                    bgcolor: 'background.paper',
                                }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}>
                                    <Box
                                        component="img"
                                        // TODO: Use the actual sprite URL
                                        src={CONFIGURATION.DEFAULT_SPRITE_URL}
                                    />
                                    <Typography>Using {ball} you'll need this many: </Typography>
                                </Box>
                                <Box>
                                    <Tooltip title={speciesDetails?.name}>
                                        <Typography>{probability}</Typography>
                                    </Tooltip>
                                </Box>
                            </Box >
                        </Tooltip>);
                })
            }
        </div >);
}

export default function ResultCard(props) {

    console.log("Result card props = ", props);
    const [pokemonDetails, setPokemonDetails] = React.useState();
    const [level, setLevel] = React.useState(50);
    const [hp, setHp] = React.useState(1);

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
        alignItems: 'center'
    }} >
        <CardHeader
            title={props.selectedPokemon}
        />
        <Tooltip title={tooltip}>
            <Box>
                <CardMedia
                    component="img"
                    height={100}
                    image={sprite}
                    alt={props.selectedPokemon}
                    sx={{ width: 100 }}
                />
                <HPSlider
                    defaultValue={hp}
                    min={1}
                    max={100}
                    onChangeCommitted={hpChangeHandler}
                />
                <Slider
                    defaultValue={level}
                    step={1}
                    min={1}
                    max={100}
                    onChangeCommitted={levelChangeHandler}
                />
            </Box>
        </Tooltip>
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