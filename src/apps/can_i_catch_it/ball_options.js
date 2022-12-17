
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Tooltip from '@mui/material/Tooltip';
import HPSlider from './hp_slider';
import Slider from '@mui/material/Slider';
import CONFIGURATION from './config.js';



import calculateCaptureProbability from './calculations.js';


export default function BallOptions(props) {

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