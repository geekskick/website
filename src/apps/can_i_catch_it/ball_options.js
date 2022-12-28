
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Balls from './data/balls.json';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import 'katex/dist/katex.min.css';
import AboutDialog from '../../components/about_dialog.js';
import GenICalculation from './gen_i_calculation'
import GenIICalculation from './gen_ii_calculation'
import GenIIICalculation from './gen_iii_calculation.js';

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

    const [probability, setProbability] = React.useState(0);
    const calculation = React.useRef();
    const [calculationDialogOpen, setCalculationDialogOpen] = React.useState(false);
    const rateCalculators = {
        "generation-i": GenICalculation,
        "generation-ii": GenIICalculation,
        "generation-iii": GenIIICalculation,
        "generation-iv": GenIIICalculation
    };

    React.useEffect(() => {
        let candidateProbability;
        try {

            calculation.current = new rateCalculators[props.selectedGeneration](props);
            candidateProbability = calculation.current.probability

            if (isNaN(candidateProbability)) {
                candidateProbability = 0.0;
            }
            console.log("Rounding probability up = ", candidateProbability);
            candidateProbability = Math.ceil(1.0 / candidateProbability);
        }
        catch (error) {
            console.log(error);
            candidateProbability = `${error}`
        }
        setProbability(candidateProbability);
    }, [props]);


    return (
        <Item>
            <Box sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box
                    component="img"
                    src={props.ballSettings[1]?.sprite}
                />
                <Typography>Using {props.ballSettings[0]} you'll need this many: </Typography><Typography>{probability}</Typography>
            </Box>
            <IconButton onClick={() => {
                setCalculationDialogOpen(true);
            }}>
                <InfoIcon />
            </IconButton>
            <AboutDialog
                open={calculationDialogOpen}
                handleAboutClose={() => {
                    setCalculationDialogOpen(false);
                }}
                text={calculation.current?.getExplaination()}
                title={"Calculation Explaination"} />
        </Item >);
}

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

                    return <BallResultItem
                        ballSettings={ball}
                        selectedGeneration={props.selectedGeneration}
                        captureRate={props.speciesDetails?.capture_rate}
                        pokemonLevel={props.pokemonLevel}
                        hp={props.hp}
                        pokemonHpStat={hpStat}
                        statusAilment={"none"} />
                })
            }

        </Stack >);
}