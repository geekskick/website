
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CONFIGURATION from './config.js';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { calculateGenICaptureProbability, calculateCaptureProbability } from './calculations.js';
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

class GenICalculation {
    constructor(props) {
        this.props = props;
        this.result = 0;
        this.ballName = props.ballSettings[0];
        this.pokemonHpCurrent = 0;
        console.log("GenICalculation::constructor");
        console.log("GenICalculation::props", props);
        if (this.ballName === 'master-ball') {
            this.probability = 1;
        }
        else {
            this.probability = calculateGenICaptureProbability(this.props.captureRate, this.props.ballSettings[1].settings['generation-i'], this.props.pokemonHpStat, this.props.pokemonLevel, this.props.hp, this.props.statusAilment, this);
        }

        this.ballsNeeded = Math.ceil(1 / this.probability);
    }

    setHpCurrent(value) {
        this.pokemonHpCurrent = value;
    }

    setF(value) {
        this.f = value;
    }

    getExplaination() {
        if (this.ballName !== 'master-ball') {
            return (<Box>
                <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">Bulbapedia</Link> defines the Generation I catch rate appropximation as:
                <BlockMath math={String.raw`\text{CaptureProbability}\approx {\color{blue}p_{0}} + {\color{red}p_{1}}`} />
                Where:
                <BlockMath math="{\color{blue}p_{0}} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1}" />
                and:
                <BlockMath math="{\color{red}p_{1}} = \frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256}" />
                which can be combined as:
                <BlockMath math={String.raw`\text{CaptureProbability} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1} + \left(\frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256}\right)`} />
                and:
                <BlockMath math={String.raw`{\color{orange}f} = \left\lfloor \frac{{\color{gold}\text{HP}_{\text{max}}} \times 255 \times 4}{\text{HP}_{\text{current}} \times {\color{red}\text{ball}}} \right\rfloor`} />
                <Divider sx={{ margin: 3 }} >AND USING</Divider>
                <BlockMath math={String.raw`{\color{red}\text{Ball}} = \begin{cases} 
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
                <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(0 + ${this.props.pokemonHpStat} + 0 + 50) \times ${this.props.pokemonLevel}}{50} + 10 \approx ${this.pokemonHpMax}`} />
                <BlockMath math={String.raw`\text{HP}_\text{current} = {\color{gold}\text{HP}_\text{max}} \times \text{HP}_\text{ratio} = ${this.pokemonHpMax} \times ${this.props.hp} \approx ${this.pokemonHpCurrent}`} />
                <BlockMath math={String.raw`{\color{red}\text{Ball}} = \text{${this.ballName}} = ${this.ballFMod}`} />
                <BlockMath math={String.raw`{\color{fuchsia}\text{ballMod}} = \text{${this.ballName}} = ${this.ballMod}`} />
                <BlockMath math={String.raw`{\color{forestgreen}\text{statusAilment}} =  \text{${this.props.statusAilment}} = ${this.statusAilment}`} />
                <BlockMath math={String.raw`{\color{orange}f} \approx \left\lfloor \frac{{\color{gold}\text{HP}_{\text{max}}} \times 255 \times 4}{\text{HP}_{\text{current}} \times {\color{red}\text{ball}}} \right\rfloor \approx \left\lfloor \frac{{\color{gold}${this.pokemonHpMax}} \times 255 \times 4}{${this.pokemonHpCurrent} \times {\color{red}${this.ballMod}}} \right\rfloor \approx ${this.f}`} />
                <BlockMath math={String.raw`{\color{red}p_{1}} = \frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256} = \frac{${this.props.captureRate} + 1}{{\color{fuchsia}${this.ballMod}} + 1} \times \frac{{\color{orange}${this.f}} + 1}{256} = ${this.p1.toPrecision(2)}`} />
                <BlockMath math={String.raw`{\color{blue}p_{0}} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1} = \frac{{\color{forestgreen}\text{${this.statusAilment}}}}{{\color{fuchsia}\text{${this.ballMod}}} + 1} = ${this.p0.toPrecision(2)}`} />
                <BlockMath math={String.raw`\text{CaptureProbability}\approx {\color{blue}p_{0}} + {\color{red}p_{1}} \approx {\color{blue}${this.p0.toPrecision(2)}} + {\color{red}${this.p1.toPrecision(2)}} \approx ${this.probability.toPrecision(2)}`} />
                <Divider sx={{ margin: 3 }}>SO FINALLY</Divider>
                <BlockMath math={String.raw`\text{Number of ${this.ballName} needed}\approx \left\lceil\frac{1}{${this.probability.toPrecision(2)}}\right\rceil \approx ${this.ballsNeeded}`} />
            </Box>);
        }
        else {
            return (<Box><Typography>Master ball always works</Typography></Box>);
        }
    }

    setP0(value) {
        this.p0 = value;
    }
    setBallFMod(value) {
        this.ballFMod = value;
    }
    setF(value) {
        this.f = value;
    }
    setP1(value) {
        this.p1 = value;
    }
    setBallMod(value) {
        this.ballMod = value;
    }
    setHpMax(value) {
        this.pokemonHpMax = value;
    }
    setAilment(value) {
        this.statusAilment = value;
    }

}

function BallResultItem(props) {
    console.log("BallResultItem::props = ", props)

    const [probability, setProbability] = React.useState(0);
    const calculation = React.useRef(new GenICalculation(props));
    const [calculationDialogOpen, setCalculationDialogOpen] = React.useState(false);

    React.useEffect(() => {
        let candidateProbability;
        try {
            if (props.ballSettings[0] === "master-ball") {
                candidateProbability = 1.0;
            }
            else {
                calculation.current = new GenICalculation(props)
                candidateProbability = calculation.current.probability
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
                text={calculation.current.getExplaination()}
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