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

    setHalfHalf() {
        this.halfHalf = true;
    }

    getExplaination() {
        console.log("explaination::ballName = ", this.ballName);
        if (this.ballName !== 'master-ball') {
            return (<Box>
                <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">Bulbapedia</Link> defines the Generation II catch rate appropximation as:
                <BlockMath math={String.raw`\text{CaptureProbability} \approx \frac{{\color{blue}a}}{{\color{red}\text{rand}_\text{max}}}`} />
                Where:
                <BlockMath math="{\color{blue}a} \approx max\left( \left\lfloor \frac{(3 \times {\color{gold}\text{HP}_\text{max}} - 2 \times \text{HP}_\text{current}) \times {\color{purple}\text{rate}_\text{modified}}}{3 \times \text{HP}_\text{max}} \right\rfloor, 1 \right) + {\color{green}\text{bonus}_\text{status}}" />
                <BlockMath math="{\color{purple}\text{rate}_\text{modified}} = \text{pokemon catch rate} \times {\color{fuchsia}\text{ball modifier}}" />
                <Divider sx={{ margin: 3 }}>AND USING</Divider>
                <BlockMath math="{\color{fuchsia}\text{ball modifier}} = \begin{cases} 
                                                            2 & \text{ultra-ball} \\
                                                            1.5 & \text{great-ball} \\
                                                            1  & \text{poke-ball}
                                                        \end{cases}" />
                <BlockMath math="{\color{green}\text{bonus}_\text{status}} = \begin{cases} 
                                                            10 & \text{sleep or freeze} \\
                                                            0 & \text{otherwise}
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
                <BlockMath math={String.raw`{\color{fuchsia}\text{ball modifier}} = \text{${this.ballName}} = ${this.ballModifier}`} />
                <BlockMath math={String.raw`{\color{green}\text{bonus}_\text{status}} = ${this.props.statusAilment} = ${this.statusAilment}`} />
                <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(0 + ${this.props.pokemonHpStat} + 0 + 50) \times ${this.props.pokemonLevel}}{50} + 10 \approx ${this.pokemonHpMax}`} />
                <BlockMath math={String.raw`\text{HP}_\text{current} = {\color{gold}\text{HP}_\text{max}} \times \text{HP}_\text{ratio} = ${this.pokemonHpMax} \times ${this.props.hp} \approx ${this.pokemonHpCurrent.toFixed(2)}`} />
                <BlockMath math={String.raw`{\color{purple}\text{rate}_\text{modified}} = \text{pokemon catch rate} \times {\color{fuchsia}\text{ball modifier}} = ${this.props.captureRate} \times {\color{fuchsia}${this.ballModifier}} = ${this.rateModified}`} />
                <BlockMath math={String.raw`{\color{blue}a} \approx max\left( \left\lfloor \frac{(3 \times {\color{gold}\text{HP}_\text{max}} - 2 \times \text{HP}_\text{current}) \times {\color{purple}\text{rate}_\text{modified}}}{3 \times {\color{gold}\text{HP}_\text{max}}} \right\rfloor, 1 \right) + {\color{green}\text{bonus}_\text{status}} \approx max\left( \left\lfloor \frac{(3 \times {\color{gold}${this.pokemonHpMax}} - 2 \times ${this.pokemonHpCurrent}) \times {\color{purple}${this.rateModified}}}{3 \times {\color{gold}${this.pokemonHpMax}}} \right\rfloor, 1 \right) + {\color{green}${this.statusAilment}} \approx ${this.a.toFixed(2)}`} />
                This {this.halfHalf ? "did" : "didn't"} invoke the double halving of < InlineMath math="3 \times {\color{gold}\text{HP}_\text{max}}" />.
                <BlockMath math={String.raw`\text{CaptureProbability} \approx \frac{{\color{blue}a}}{{\color{red}\text{rand}_\text{max}}} \approx \frac{{\color{blue}${this.a.toFixed(2)}}}{{\color{red}255}} \approx ${this.probability.toFixed(2)}`} />
                <Divider sx={{ margin: 3 }}>SO FINALLY</Divider>
                <BlockMath math={String.raw`\text{Number of ${this.ballName}s needed } \approx \frac{1}{\text{CaptureProbability}} \approx \frac{1}{${this.probability.toFixed(2)}} \approx ${this.ballsNeeded}`} />

            </Box >);
        }
        else {
            console.log("Masterball message");
            return (<Box>Master ball always works</Box>);
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
    setRateModified(value) {
        this.rateModified = value;
    }
    setA(value) {
        this.a = value;
    }

}