import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CaptureGuage } from './capture_gauge';
import Pokedex from 'pokedex-promise-v2';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ErrorBoundary } from './error_boundary';

const P = new Pokedex();


class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selected_mon: null,
            capture_rate: null,
            selected_generation: null,
            possible_generations: this.props.generations,
            capture_probability: null,
            selected_ball: null
        }
    }

    onGenericError(error, info) {
        NotificationManager.error(error + info);
    }

    onSelectBall(ball) {
        console.log("onSelectBall::ball = " + ball);
        NotificationManager.info("Selected " + ball.value);
    }

    async onSelectPokemon(mon) {
        console.log("onSelect::mon = ", mon);
        NotificationManager.info("Selected " + mon.value);
        try {
            const prom = await this.props.api.getPokemonSpeciesByName(mon.value);
            console.log("onSelect::prom = ", prom);
            this.setState(previous_state => ({
                selected_generation: prom.generation.name,
                possible_generations: previous_state.possible_generations,
                selected_mon: mon.value,
                capture_rate: prom.capture_rate,
                capture_probability: this.calculateCaptureRate(prom.generation.name)
            }));
        }
        catch (error) {
            console.log("onSelect::error = ", error);
            NotificationManager.error("Unable to get the details of pokemon species " + mon.value);
            this.setState(
                previous_state => ({
                    selected_generation: null,
                    possible_generations: previous_state.possible_generations,
                    selected_mon: null,
                    capture_rate: null,
                    capture_probability: null
                })

            );
        }
    }

    onSelectGenerations(mon) {
        console.log("Selected = ", mon.value);
        NotificationManager.info("Selected " + mon.value);
        this.setState(
            previous_state => ({
                selected_generation: mon.value,
                possible_generations: previous_state.possible_generations,
                selected_mon: previous_state.selected_mon,
                capture_rate: previous_state.capture_rate,
                capture_probability: this.calculateCaptureRate(mon.value)
            })

        );
    }

    calculateGenIF() {
        const hp_max = 100;
        const hp_current = 50;
        // assume pokeball
        const ball = 12;
        return (hp_max * 255 * 4) / (hp_current * ball);
    }

    calculateGenICaptureRate() {
        // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
        // TODO: Get user status ailment
        const status_ailent = 0;

        // TODO: Get user pokeball used
        const ball_mod = 255;
        const p0 = status_ailent / (ball_mod + 1);

        // TODO: Calculate this
        const f = this.calculateGenIF();
        console.log("GenIF() = " + f);
        const p1 = ((this.state.capture_rate + 1) / (ball_mod + 1)) * ((f + 1) / 256);
        console.log("p0 = " + p0 + ", p1 = " + p1);
        return p0 + p1;
    }

    calculateCaptureRate(generation_name) {
        try {
            const rate_calculators = {
                "generation-i": this.calculateGenICaptureRate.bind(this)
            }
            console.log("Selected generation = " + generation_name);
            const rc = rate_calculators[generation_name]();
            console.log("Rate calculated as " + rc);
            return rc;
        }
        catch (error) {
            console.log(error)
            NotificationManager.error(generation_name + " is not a valid generation name", "Calculation Error");
        }
    }

    onCaptureGaugeError(error) {
        console.log(error);
        NotificationManager.error("Error in the capture gauge: " + error);
    }

    onStatusChange(status) {
        console.log("New status = " + status.value);
    }
    render() {
        console.log("App::render = ", this);
        return (
            <div>
                <ErrorBoundary onError={this.onGenericError.bind(this)}>
                    <Dropdown
                        className="ball-selector"
                        options={["Pokeball", "Greatball"]}
                        onChange={this.onSelectBall.bind(this)}
                        value={this.state.selected_Ball}
                        placeholder="Select a Ball Type" />
                    <hr className="rule"/>
                    <Dropdown
                        classname="pokemon-selector"
                        options={this.props.pokemon}
                        onChange={this.onSelectPokemon.bind(this)}
                        value={this.state.selected_mon}
                        placeholder="Select a Pokemon" />
                    <hr className="rule"/>
                    <CaptureGuage
                        classname="capture-gauge"
                        mon={this.state.selected_mon}
                        rate={this.state.capture_rate}
                        onError={this.onCaptureGaugeError.bind(this)} />
                    <hr className="rule"/>
                    <Dropdown
                        classname="generation-selector"
                        options={this.props.generations}
                        onChange={this.onSelectGenerations.bind(this)}
                        value={this.state.selected_generation}
                        placeholder="Select a Generation" />
                    <hr className="rule"/>
                    <Dropdown
                        classname='status-selector'
                        options={["none"]}
                        onChange={this.onStatusChange.bind(this)}
                        value={["none"]}
                    />
                    <hr className="rule"/>
                    <h1 className="probability">{this.state.capture_probability}</h1>
                </ErrorBoundary>
                <NotificationContainer />

            </div>)
    }

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function getPokemonList(api) {
    const prom = await api.getPokemonsList({ limit: 1500 });
    return prom.results
}

async function getGenerationsList(api) {
    const prom = await api.getGenerationsList();
    return prom.results.map(p => p.name);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
(async () => {
    try {
        const pokemon = await getPokemonList(P);
        const generations = await getGenerationsList(P);
        root.render(<App api={P} pokemon={pokemon.map(p => p.name)} generations={generations} />);
    } catch (error) {
        console.log("Error = ", error);
        NotificationManager.error("Unable to get either the pokemon list, or the generation list. Try refreshing the page");
        root.render(<NotificationContainer />);
    }
})()
