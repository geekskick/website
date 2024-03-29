import * as React from 'react';
import Box from '@mui/material/Box';
import { Link, Divider } from '@mui/material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { calculateGenVCaptureProbability } from './../calculations.js';

export default class GenVCalculation {
    constructor(props) {
        this.props = props;
        this.result = 0;
        this.ballName = props.ballSettings[0];
        this.pokemonHpCurrent = 0;
        console.log('GenVCalculation::constructor');
        console.log('GenVCalculation::props', props);
        if (this.ballName === 'master-ball') {
            this.probability = 1;
        } else {
            this.probability = calculateGenVCaptureProbability(this.props.captureRate,
                this.props.ballSettings[1].settings['generation-v'],
                this.props.pokemonHpStat,
                this.props.pokemonLevel,
                this.props.hp,
                this.props.statusAilment,
                this);
        }

        this.ballsNeeded = Math.ceil(1 / this.probability);
    }

    setHpCurrent(value) {
        this.pokemonHpCurrent = value;
    }

    getExplaination() {
        console.log('explaination::ballName = ', this.ballName);
        if (this.ballName !== 'master-ball') {
            return (<Box>
                <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">
                    Bulbapedia
                </Link>
                &nbsp;
                defines the Generation V catch rate approximation as:
                <BlockMath math={String.raw`\text{CaptureProbability} \approx \frac{{\color{blue}a}}{4096}`} />
                Where:
                {/* eslint-disable-next-line max-len */}
                <BlockMath math="{\color{blue}a} \approx \frac{(3 \times {\color{gold}\text{HP}_\text{max}} - 2 \times \text{HP}_\text{current}) \times 4096 \times {\color{dodgerblue}\text{darkGrass}} \times \text{rate} \times {\color{fuchsia}\text{bonus}_\text{ball}}}{3 \times {\color{gold}\text{HP}_\text{max}}}\times {\color{green}\text{bonus}_\text{status}} \times {\color{darkorange}\text{passPower}}" />
                <Divider sx={{ margin: 3 }}>AND USING</Divider>
                <BlockMath math="{\color{fuchsia}\text{bonus}_\text{ball}} = \begin{cases}
                                                            2 & \text{ultra-ball} \\
                                                            1.5 & \text{great-ball} \\
                                                            1  & \text{poke-ball}
                                                        \end{cases}" />
                <BlockMath math="{\color{green}\text{bonus}_\text{status}} = \begin{cases}
                                                            2.5 & \text{sleep,freeze} \\
                                                            1.5 & \text{paralyse, poison, burn} \\
                                                            1 & \text{otherwise}
                                                            \end{cases}" />
                <BlockMath math="{\color{darkorange}\text{passPower}} = \begin{cases}
                                                            1.3 & \uparrow\uparrow\uparrow \\
                                                            1.2 & \uparrow\uparrow \\
                                                            1.1 & \uparrow \\
                                                            1   & otherwise
                                                        \end{cases}" />
                <BlockMath math="{\color{dodgerblue}\text{darkGrass}} = \begin{cases}
                                                            1   & 601 \leq \text{caught} \\
                                                            0.9 & 451 \leq \text{caught} \leq 600 \\
                                                            0.8 & 301 \leq \text{caught} \leq 450 \\
                                                            0.7 & 151 \leq \text{caught} \leq 300 \\
                                                            0.6 & 30 \leq \text{caught} \leq 150 \\
                                                            0.5 & otherwise
                                                        \end{cases}" />
                According to <Link href={'https://pokemon.neoseeker.com/wiki/Statistic#HP'}>Neoseeker</Link>
                the formula for calculating <InlineMath math={String.raw`{\color{gold}\text{HP}_\text{max}}`} /> is:
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(\text{IV} + \text{Base} + \frac{\sqrt{\text{EV}}}{8} + 50) \times \text{Level}}{50} + 10`} />
                We ignore both IV and EV vales for simplicity.  <br />
                <Divider sx={{ margin: 3 }}>THEREFORE</Divider>
                Plugging our values in we get:
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`{\color{fuchsia}\text{bonus}_\text{ball}} = \text{${this.ballName}} = ${this.ballModifier}`} />
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`{\color{green}\text{bonus}_\text{status}} = ${this.props.statusAilment} = ${this.statusAilment}`} />
                <BlockMath math={String.raw`{\color{darkorange}\text{passPower}} = ${this.passPower}`} />
                <BlockMath math={String.raw`{\color{dodgerblue}\text{darkGrass}} = ${this.darkGrass}`} />
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`{\color{gold}\text{HP}_\text{max}} = \frac{(0 + ${this.props.pokemonHpStat} + 0 + 50) \times ${this.props.pokemonLevel}}{50} + 10 \approx ${this.pokemonHpMax}`} />
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`\text{HP}_\text{current} = {\color{gold}\text{HP}_\text{max}} \times \text{HP}_\text{ratio} = ${this.pokemonHpMax} \times ${this.props.hp} \approx ${this.pokemonHpCurrent.toFixed(2)}`} />
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`{\color{blue}a} \approx \frac{(3 \times {\color{gold}${this.pokemonHpMax}} - 2 \times ${this.pokemonHpCurrent.toFixed(2)}) \times 4096 \times {\color{dodgerblue}${this.darkGrass}} \times ${this.props.captureRate} \times {\color{fuchsia}${this.ballModifier}}}{3 \times {\color{gold}${this.pokemonHpMax}}}\times {\color{green}${this.statusAilment}} \times {\color{darkorange}${this.passPower}} \approx ${this.probability.toFixed(2)}`} />
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`\text{CaptureProbability} \approx \frac{{\color{blue}a}}{255} \approx \frac{{\color{blue}${this.a.toFixed(2)}}}{4096} \approx ${this.probability.toFixed(2)}`} />
                <Divider sx={{ margin: 3 }}>SO FINALLY</Divider>
                {/* eslint-disable-next-line max-len */}
                <BlockMath math={String.raw`\text{Number of ${this.ballName}s needed } \approx \frac{1}{\text{CaptureProbability}} \approx \frac{1}{${this.probability.toFixed(2)}} \approx ${this.ballsNeeded}`} />


            </Box >);
        } else {
            console.log('Masterball message');
            return (<Box>Master ball always works</Box>);
        }
    }

    setBallModifier(value) {
        console.log('GenVCalculation::setBallModifier(' + value + ')');
        this.ballModifier = value;
    }
    setHpMax(value) {
        this.pokemonHpMax = value;
    }
    setAilment(value) {
        this.statusAilment = value;
    }
    setA(value) {
        this.a = value;
    }

    setPassPower(value) {
        this.passPower = value;
    }

    setDarkGrass(value) {
        this.darkGrass = value;
    }
}
