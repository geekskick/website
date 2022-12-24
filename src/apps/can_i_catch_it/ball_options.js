
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CONFIGURATION from './config.js';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import calculateCaptureProbability from './calculations.js';
import Balls from './data/balls.json';
import { IconButton, Link, Divider } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import AboutDialog from '../../components/about_dialog.js';

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

function CalculationExplaination(props) {
    return (<Box>
        <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">Bulbapedia</Link> defines the Generation I catch rate appropximation as:
        <BlockMath renderError={(error) => {
            return <b>Fail: {error.name}</b>;
        }} math={String.raw`\text{CaptureProbability}\approx {\color{blue}p_{0}} + {\color{red}p_{1}}`} />
        Where:
        <BlockMath renderError={(error) => {
            return <b>Fail: {error.name}</b>;
        }} math="{\color{blue}p_{0}} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1}" />
        and:
        <BlockMath renderError={(error) => {
            return <b>Fail: {error.name}</b>;
        }} math="{\color{red}p_{1}} = \frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256}" />
        which can be combined as:
        <BlockMath renderError={(error) => {
            return <b>Fail: {error.name}</b>;
        }} math={String.raw`\text{CaptureProbability} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1} + \left(\frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256}\right)`} />
        and:
        <BlockMath renderError={(error) => {
            return <b>Fail: {error.name}</b>;
        }} math={String.raw`{\color{orange}f} = \left\lfloor \frac{{\color{gold}\text{HP}_{\text{max}}} \times 255 \times 4}{\text{HP}_{\text{current}} \times {\color{red}\text{ball}}} \right\rfloor`} />
        <Divider sx={{ margin: 3 }} >AND USING</Divider>
        <BlockMath renderError={(error) => {
            return <b>Fail: {error.name}</b>;
        }} math={String.raw`{\color{red}\text{Ball}} = \begin{cases} 
                                                                        8 & \text{if great-ball} \\
                                                                        12 & \text{otherwise}
                                                                        \end{cases}`} />
        <BlockMath math={String.raw`{\color{fuchsia}\text{ballMod}} = \begin{cases}
                                                                        255 & \text{if poke-ball} \\
                                                                        200 & \text{if great-ball} \\
                                                                        150 & \text{otherwise}
                                                                    \end{cases}`} />
        <BlockMath math={String.raw`{\color{forestgreen}\text{statusAilment}} =  \begin{cases}
                                                                            12 &\text{if poison, burned, paralysed}  \\
                                                                            25 &\text{if frozen, asleep} \\ 
                                                                            0 &\text{otherwise}\\
                                                                            \end{cases}`} />
        According to <Link href={"https://pokemon.neoseeker.com/wiki/Statistic#HP"}>Neoseeker</Link> the formula for calculating <InlineMath math={String.raw`{\color{gold}\text{HP}_\text{max}}`} /> is:
        <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(\text{IV} + \text{Base} + \frac{\sqrt{\text{EV}}}{8} + 50) \times \text{Level}}{50} + 10`} />
        We ignore both IV and EV vales for simplicity.
        <Divider sx={{ margin: 3 }} >THEREFORE</Divider>
        Plugging in our values we get:
        <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(0 + ${props.hpStat} + 0 + 50) \times ${props.pokemonLevel}}{50} + 10 \approx ${props.pokemonHpMax}`} />
        <BlockMath math={String.raw`\text{HP}_\text{current} = {\color{gold}\text{HP}_\text{max}} \times \text{HP}_\text{ratio} = ${props.pokemonHpMax} \times ${props.hp} \approx ${props.pokemonHpCurrent}`} />
        <BlockMath math={String.raw`{\color{red}\text{Ball}} = \text{${props.ballName}} = ${props.ballFMod}`} />
        <BlockMath math={String.raw`{\color{fuchsia}\text{ballMod}} = \text{${props.ballName}} = ${props.ballMod}`} />
        <BlockMath math={String.raw`{\color{forestgreen}\text{statusAilment}} =  \text{${props.statusAilmentName}} = ${props.statusAilment}`} />
        <BlockMath math={String.raw`{\color{orange}f} \approx \left\lfloor \frac{{\color{gold}\text{HP}_{\text{max}}} \times 255 \times 4}{\text{HP}_{\text{current}} \times {\color{red}\text{ball}}} \right\rfloor \approx \left\lfloor \frac{{\color{gold}${props.pokemonHpMax}} \times 255 \times 4}{${props.pokemonHpCurrent} \times {\color{red}${props.ballMod}}} \right\rfloor \approx ${props.f}`} />
        <BlockMath math={String.raw`{\color{red}p_{1}} = \frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256} = \frac{${props.catchRate} + 1}{{\color{fuchsia}${props.ballMod}} + 1} \times \frac{{\color{orange}${props.f}} + 1}{256} = ${props.p1}`} />
    </Box>);
}
function BallResultItem(props) {
    console.log("BallResultItem::props = ", props)


    const [pokemonHpMax, setPokemonHpMax] = React.useState(0);
    const [ballFMod, setBallFMod] = React.useState(0);
    const [ballMod, setBallMod] = React.useState(0);
    const [statusAilment, setStatusAilment] = React.useState(0);
    const [probability, setProbability] = React.useState(0);
    const [pokemonHpCurrent, setPokemonHpCurrent] = React.useState(0);
    const [f, setF] = React.useState(0);
    const [p1, setP1] = React.useState(0);
    const [calculationDialogOpen, setCalculationDialogOpen] = React.useState(false);

    React.useEffect(() => {
        let candidateProbability;
        try {
            if (props.ball[0] === "master-ball") {
                candidateProbability = 1.0;
            }
            else {
                candidateProbability = calculateCaptureProbability(
                    props.selectedGeneration,
                    props.captureRate,
                    props.ball[1].settings,
                    props.hpStat,
                    props.pokemonLevel,
                    props.hp,
                    props.statusAilment,
                    setPokemonHpMax,
                    setPokemonHpCurrent,
                    setBallFMod,
                    setBallMod,
                    setStatusAilment,
                    setF,
                    setP1);
            }
            if (candidateProbability === NaN) {
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
    }, [props.ball, props.selectedGeneration, props.captureRate, props.hpStat, props.hp, props.statusAilment]);


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
                    src={props.ball[1]?.sprite}
                />
                <Typography>Using {props.ball[0]} you'll need this many: </Typography><Typography>{probability}</Typography>
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
                text={<CalculationExplaination
                    pokemonHpCurrent={Math.round(pokemonHpCurrent)}
                    pokemonHpMax={Math.round(pokemonHpMax)}
                    pokemonLevel={props.pokemonLevel}
                    hpStat={Math.round(props.hpStat)}
                    hp={Math.round(props.hp)}
                    ballName={props.ball[0]}
                    ballFMod={Math.round(ballFMod)}
                    ballMod={Math.round(ballMod)}
                    statusAilment={Math.round(statusAilment)}
                    statusAilmentName={props.statusAilment}
                    f={Math.round(f)}
                    catchRate={props.captureRate}
                    p1={p1.toPrecision(2)} />}
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
                        ball={ball}
                        selectedGeneration={props.selectedGeneration}
                        captureRate={props.speciesDetails?.capture_rate}
                        pokemonLevel={props.pokemonLevel}
                        hp={props.hp}
                        hpStat={hpStat}
                        statusAilment={"none"} />
                })
            }

        </Stack >);
}