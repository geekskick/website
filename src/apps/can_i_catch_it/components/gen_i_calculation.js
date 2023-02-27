import { calculateGenICaptureProbability } from '../calculations/gen_i';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link, Divider } from '@mui/material';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export default class GenICalculation {
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
                <Link href="https://bulbapedia.bulbagarden.net/wiki/Catch_rate#Approximate_probability">Bulbapedia</Link> and <Link href="https://www.dragonflycave.com/mechanics/gen-i-capturing">Dragonfly Cave</Link> define the Generation I catch rate appropximation as:
                <BlockMath math={String.raw`\text{CaptureProbability}\approx {\color{blue}p_{0}} + {\color{red}p_{1}}`} />
                Where:
                <BlockMath math="{\color{blue}p_{0}} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1}" />
                and:
                <BlockMath math="{\color{red}p_{1}} = \frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256}" />
                which can be combined as:
                <BlockMath math={String.raw`\text{CaptureProbability} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1} + \left(\frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256}\right)`} />
                and:
                <BlockMath math={String.raw`{\color{orange}f} = \text{min}\left( \left\lfloor \frac{{\color{gold}\text{HP}_{\text{max}}} \times 255 \times 4}{\text{HP}_{\text{current}} \times {\color{red}\text{ball}}} \right\rfloor, 255 \right)`} />
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
                <BlockMath math={String.raw`\text{HP}_\text{current} = {\color{gold}\text{HP}_\text{max}} \times \text{HP}_\text{ratio} = ${this.pokemonHpMax} \times ${this.props.hp} \approx ${this.pokemonHpCurrent.toFixed(2)}`} />
                <BlockMath math={String.raw`{\color{red}\text{Ball}} = \text{${this.ballName}} = ${this.ballFMod}`} />
                <BlockMath math={String.raw`{\color{fuchsia}\text{ballMod}} = \text{${this.ballName}} = ${this.ballMod}`} />
                <BlockMath math={String.raw`{\color{forestgreen}\text{statusAilment}} =  \text{${this.props.statusAilment}} = ${this.statusAilment}`} />
                <BlockMath math={String.raw`{\color{orange}f} \approx \text{min} \left ( \left\lfloor \frac{{\color{gold}${this.pokemonHpMax}} \times 255 \times 4}{${this.pokemonHpCurrent.toFixed(2)} \times {\color{red}${this.ballMod}}} \right\rfloor, 255 \right ) \approx ${this.f.toFixed(4)}`} />
                <BlockMath math={String.raw`{\color{red}p_{1}} = \frac{\text{catchRate} + 1}{{\color{fuchsia}\text{ballMod}} + 1} \times \frac{{\color{orange}f} + 1}{256} = \frac{${this.props.captureRate} + 1}{{\color{fuchsia}${this.ballMod}} + 1} \times \frac{{\color{orange}${this.f.toFixed(2)}} + 1}{256} = ${this.p1.toFixed(4)}`} />
                <BlockMath math={String.raw`{\color{blue}p_{0}} = \frac{{\color{forestgreen}\text{statusAilment}}}{{\color{fuchsia}\text{ballMod}} + 1} = \frac{{\color{forestgreen}\text{${this.statusAilment}}}}{{\color{fuchsia}\text{${this.ballMod}}} + 1} = ${this.p0.toFixed(2)}`} />
                <BlockMath math={String.raw`\text{CaptureProbability}\approx {\color{blue}p_{0}} + {\color{red}p_{1}} \approx {\color{blue}${this.p0.toFixed(2)}} + {\color{red}${this.p1.toFixed(2)}} \approx ${this.probability.toFixed(2)}`} />
                <Divider sx={{ margin: 3 }}>SO FINALLY</Divider>
                <BlockMath math={String.raw`\text{Number of ${this.ballName}s needed}\approx \left\lceil\frac{1}{${this.probability.toFixed(2)}}\right\rceil \approx ${this.ballsNeeded}`} />
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