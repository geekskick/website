import { calculateGenICaptureProbability } from './calculations.js';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CONFIGURATION from './config.js';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
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
import { calculateGenIICaptureProbability } from './calculations.js';

export default class GenIICalculation {
    constructor(props) {
        this.props = props;
        this.result = 0;
        this.ballName = props.ballSettings[0];
        this.pokemonHpCurrent = 0;
        console.log("GenIICalculation::constructor");
        console.log("GenIICalculation::props", props);
        if (this.ballName === 'master-ball') {
            this.probability = 1;
        }
        else {
            this.probability = calculateGenIICaptureProbability(this.props.captureRate, this.props.ballSettings[1].settings['generation-ii'], this.props.pokemonHpStat, this.props.pokemonLevel, this.props.hp, this.props.statusAilment, this);
        }

        this.ballsNeeded = Math.ceil(1 / this.probability);
    }

    setHpCurrent(value) {
        this.pokemonHpCurrent = value;
    }

    getExplaination() {
        if (this.ballName !== 'master-ball') {
            return (<Box>
                <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">Bulbapedia</Link> defines the Generation II catch rate appropximation as:
                <BlockMath math={String.raw`\text{CaptureProbability}=\frac{{\color{blue}a}}{{\color{red}\text{rand}_\text{max}}}`} />
                Where:
                <BlockMath math="{\color{blue}a} = max\left( \left\lfloor \frac{(3 \times {\color{gold}\text{HP}_\text{max}} - 2 \times \text{HP}_\text{current}) \times {\color{purple}\text{rate}_\text{modified}}}{3 \times \text{HP}_\text{max}} \right\rfloor, 1 \right) + \text{bonus}_\text{status}" />
                <BlockMath math="{\color{purple}\text{rate}_\text{modified}} = \text{pokemon catch rate} \times {\color{green}\text{ball modifier}}" />
                <Divider sx={{ margin: 3 }}>AND USING</Divider>
                <BlockMath math="{\color{green}\text{ball modifier}} = \begin{cases} 
                                                            2 & \text{ultra-ball} \\
                                                            1.5 & \text{great-ball} \\
                                                            1  & \text{poke-ball}
                                                        \end{cases}" />

                <BlockMath math="{\color{red}\text{rand}_\text{max}} = 255" />

                According to <Link href={"https://pokemon.neoseeker.com/wiki/Statistic#HP"}>Neoseeker</Link> the formula for calculating <InlineMath math={String.raw`{\color{gold}\text{HP}_\text{max}}`} /> is:
                <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(\text{IV} + \text{Base} + \frac{\sqrt{\text{EV}}}{8} + 50) \times \text{Level}}{50} + 10`} />
                We ignore both IV and EV vales for simplicity.  <br />
                There are additional constraints which we must take into account:
                <ol>
                    <li>If < InlineMath math="3 \times {\color{gold}\text{HP}_\text{max}} > 255" /> then both <InlineMath math="3 \times {\color{gold}\text{HP}_\text{max}}" /> and < InlineMath math="2 \times \text{HP}_\text{current}" /> are halved twice. </li>
                    <li><InlineMath math="{\color{blue}a}" /> must be <InlineMath math="< 255" /></li>
                    <li>If <InlineMath math="{\color{gold}\text{HP}_\text{max}} > 342" /> then <InlineMath math="3 \times {\color{gold}\text{HP}_\text{max}}" /> is truncated. Fortunately this is not a possible <InlineMath math="{\color{gold}\text{HP}_\text{max}}" /></li>
                    <li><InlineMath math="1 \leq {\color{purple}\text{rate}_\text{modified}} \leq 255" /></li>
                </ol>
                <Divider sx={{ margin: 3 }}>THEREFORE</Divider>
                Plugging our values in we get:
                <BlockMath math={String.raw`{\color{green}\text{ball modifier}} = \text{${this.ballName}} = ${this.ballModifier}`} />
            </Box >);
        }
        else {
            return (<Box><Typography>Master ball always works</Typography></Box>);
        }
    }

    setBallModifier(value) {
        console.log("GenIICalculation::setBallModifier(" + value + ")");
        this.ballModifier = value;
    }
    setHpMax(value) {
        this.pokemonHpMax = value;
    }
    setAilment(value) {
        this.statusAilment = value;
    }

}