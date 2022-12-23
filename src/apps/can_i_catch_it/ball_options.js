
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CONFIGURATION from './config.js';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import calculateCaptureProbability from './calculations.js';
import Balls from './data/balls.json';
import { IconButton } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

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

function BallResultItem(props) {
    console.log("BallResultItem::props = ", props)
    // Make the icon and the text on the same line - pulled from here:
    // https://stackoverflow.com/questions/51940157/how-to-align-horizontal-icon-and-text-in-mui
    let probability;
    try {
        if (props.ball[0] === "master-ball") {
            probability = 1.0;
        }
        else {
            probability = calculateCaptureProbability(props.selectedGeneration, props.captureRate, props.ball[1].settings, props.hpStat, props.pokemonLevel, props.hp);
        }
        if (probability === NaN) {
            probability = 0.0;
        }
        console.log("Rounding probability up = ", probability);
        probability = Math.ceil(1.0 / probability);
    }
    catch (error) {
        console.log(error);
        probability = `${error}`
    }
    return (
        <Item>
            <Accordion sx={{
                width: '100%',
                boxShadow: 'none'
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box
                            component="img"
                            src={props.ball[1]?.sprite}
                        />
                        <Typography>Using {props.ball[0]} you'll need this many: </Typography><Typography>{probability}</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    Hello
                </AccordionDetails>
            </Accordion>
        </Item >);
}

export default function BallOptions(props) {
    console.log("BallOptions::props = ", props);
    const hpStat = props.pokemonDetails?.stats.filter(stat => stat.stat?.name === "hp")[0].base_stat;
    console.log(`${props.selectedPokemon} has a base hp stat of ${hpStat}`);

    const [hpMax, setHpMax] = React.useState(0);
    const [hpCurrent, setHpCurrent] = React.useState(0);
    const [ballMod, setBallMod] = React.useState(0);

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
                    return <BallResultItem
                        ball={ball}
                        selectedGeneration={props.selectedGeneration}
                        captureRate={props.speciesDetails?.capture_rate}
                        pokemonLevel={props.pokemonLevel}
                        hp={props.hp}
                        hpStat={hpStat} />
                })
            }

        </Stack >);
}