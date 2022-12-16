import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader, Tooltip } from '@mui/material';
import CONFIGURATION from './config.js';
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

    console.log("Rendering the BallOptions");
    console.log("specied details = ", speciesDetails);
    return (
        <div>

            {
                ballList.map(ball => {
                    // Make the icon and the text on the same line - pulled from here:
                    // https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-mui
                    return (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                p: 1,
                                m: 1,
                                border: 'solid',
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                            }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                            }}>
                                <Box
                                    component="img"
                                    src={CONFIGURATION.DEFAULT_SPRITE_URL}
                                />
                                <Typography>{ball}</Typography>
                            </Box>
                            <Box>
                                <Tooltip title={speciesDetails?.name}>
                                    <Typography>{speciesDetails?.capture_rate}</Typography>
                                </Tooltip>
                            </Box>
                        </Box >);
                })
            }
        </div >);
}

export default function ResultCard(props) {

    console.log("Result card props = ", props);
    const [pokemonDetails, setPokemonDetails] = React.useState();

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
                <BallOptions selectedGeneration={props.selectedGeneration} selectedPokemon={props.selectedPokemon} api={props.api} />
            </CardContent>
        </Box>
    </Card >);
}