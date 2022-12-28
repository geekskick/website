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
import { calculateGenIIICaptureProbability } from './calculations.js';

export default class GenIIICalculation {
    constructor(props) {
        this.props = props;
        this.result = 0;
        this.ballName = props.ballSettings[0];
        this.pokemonHpCurrent = 0;
        console.log("GenIIICalculation::constructor");
        console.log("GenIIICalculation::props", props);
        if (this.ballName === 'master-ball') {
            this.probability = 1;
        }
        else {
            this.probability = calculateGenIIICaptureProbability(this.props.captureRate, this.props.ballSettings[1].settings['generation-iii'], this.props.pokemonHpStat, this.props.pokemonLevel, this.props.hp, this.props.statusAilment, this);
        }

        this.ballsNeeded = Math.ceil(1 / this.probability);
    }

    setHpCurrent(value) {
        this.pokemonHpCurrent = value;
    }

    setHalfHalf() {
        this.halfHalf = true;
    }

    getExplaination() {
        console.log("explaination::ballName = ", this.ballName);
        if (this.ballName !== 'master-ball') {
            return (<Box>
                <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">Bulbapedia</Link> defines the Generation III catch rate appropximation as:
                <BlockMath math={String.raw`\text{CaptureProbability} \approx \frac{{\color{blue}a}}{255}`} />
                Where:
                <BlockMath math="{\color{blue}a} \approx \frac{(3 \times {\color{gold}\text{HP}_\text{max}} - 2 \times \text{HP}_\text{current}) \times \text{rate} \times {\color{fuchsia}\text{bonus}_\text{ball}}}{3 \times {\color{gold}\text{HP}_\text{max}}}\times {\color{green}\text{bonus}_\text{status}}" />
                <Divider sx={{ margin: 3 }}>AND USING</Divider>
                <BlockMath math="{\color{fuchsia}\text{bonus}_\text{ball}} = \begin{cases} 
                                                            2 & \text{ultra-ball} \\
                                                            1.5 & \text{great-ball} \\
                                                            1  & \text{poke-ball}
                                                        \end{cases}" />
                <BlockMath math="{\color{green}\text{bonus}_\text{status}} = \begin{cases} 
                                                            2 & \text{sleep,freeze} \\
                                                            1.5 & \text{paralyse, poison, burn} \\
                                                            1 & \text{otherwise}
                                                        \end{cases}" />
            </Box >);
        }
        else {
            console.log("Masterball message");
            return (<Box>Master ball always works</Box>);
        }
    }

    setBallModifier(value) {
        console.log("GenIIICalculation::setBallModifier(" + value + ")");
        this.ballModifier = value;
    }
    setHpMax(value) {
        this.pokemonHpMax = value;
    }
    setAilment(value) {
        this.statusAilment = value;
    }
    setRateModified(value) {
        this.rateModified = value;
    }
    setA(value) {
        this.a = value;
    }

}