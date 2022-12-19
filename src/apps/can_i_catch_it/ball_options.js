
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CONFIGURATION from './config.js';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import calculateCaptureProbability from './calculations.js';
import Balls from './data/balls.json';

const Item = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: 0,// theme.spacing(1),
    margin: 0,
    color: theme.palette.text.secondary,
    border: 'none',
    borderColor: 'pink',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
}));



export default function BallOptions(props) {
    console.log("BallOptions::props = ", props);
    const hpStat = props.pokemonDetails?.stats.filter(stat => stat.stat?.name === "hp")[0].base_stat;
    console.log(`${props.selectedPokemon} has a base hp stat of ${hpStat}`);
    return (
        <Stack
            spacing={2}
            sx={{
                alignItems: 'center',
                justifyContent: 'space-evenly',
                //border: 'solid',
                width: '100%'
            }} >

            {
                Object.entries(Balls).map(ball => {
                    console.log("ball = ", ball)
                    // Make the icon and the text on the same line - pulled from here:
                    // https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-mui
                    let probability;
                    try {
                        if (ball[0] === "master-ball") {
                            probability = 1.0;
                        }
                        else {
                            probability = calculateCaptureProbability(props.selectedGeneration, props.speciesDetails?.capture_rate, ball[1].settings, hpStat, props.pokemonLevel, props.hp);
                        }
                        if (probability === NaN) {
                            probability = 0.0;
                        }
                        console.log("Rounding probability up = ", probability);
                        probability = Math.ceil(1.0 / probability);
                    }
                    catch (error) {
                        console.log(error);
                        probability = `Unable to calculate using ${props.selectedGeneration}`
                    }
                    return (
                        <Item>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Box
                                    component="img"
                                    // TODO: Use the actual sprite URL
                                    src={ball[1]?.sprite}
                                />
                                <Typography>Using {ball[0]} you'll need this many: </Typography>
                            </Box>
                            <Typography>{probability}</Typography>
                        </Item>);
                })
            }
        </Stack >);
}