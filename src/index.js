import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CaptureGuage } from './capture_gauge';
import Pokedex from 'pokedex-promise-v2';
import LabelledDropdown from './dropdown';
import 'react-dropdown/style.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ErrorBoundary } from './error_boundary';
import balls from './data/balls.json'

const P = new Pokedex();
const PAGE_SIZE = 20;

function App(props) {

    const [selectedMon, setSelectedMon] = React.useState('');
    const [captureRate, setCaptureRate] = React.useState(0.0);
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [possibleGenerations, setPossibleGenerations] = React.useState('');
    const [captureProbability, setCaptureProbability] = React.useState(0.0);
    const [selectedBall, setSelectedBall] = React.useState('');

    const onGenericError = (error, info) => {
        NotificationManager.error(error + info);
    }

    const onSelectBall = (ball) => {
        console.log(`onSelectBall::ball = ${ball}`);
        NotificationManager.info(`Selected ${ball.target.value}`);
    }

    const onSelectPokemon = async (mon) => {
        console.log(`onSelect::mon = ${mon}`);
        NotificationManager.info(`Selected ${mon.target.value}`);
        try {
            const prom = await props.api.getPokemonSpeciesByName(mon.target.value);
            console.log(`onSelect::prom = ${prom}`);
            setSelectedGeneration(prom.generation.name);
            setCaptureRate(prom.capture_rate);
            setCaptureProbability(calculateCaptureRate(prom.generation.name));
        }
        catch (error) {
            console.log("onSelect::error = ", error);
            NotificationManager.error(`Unable to get the details of pokemon species ${mon.target.value}`);
            setSelectedGeneration(null);
            setSelectedMon(null);
            setCaptureRate(null);
            setCaptureProbability(null);
        }
    }

    const onSelectGenerations = (mon) => {
        console.log(`Selected = ${mon.target.value}`);
        NotificationManager.info(`Selected ${mon.target.value}`);
        setSelectedGeneration(mon.target.value);
        setCaptureProbability(calculateCaptureRate(mon.target.value));
    }

    const calculateGenIF = () => {
        const hp_max = 100;
        const hp_current = 50;
        // assume pokeball
        const ball = 12;
        return (hp_max * 255 * 4) / (hp_current * ball);
    }

    const calculateGenICaptureRate = () => {
        // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
        // TODO: Get user status ailment
        const status_ailent = 0;

        // TODO: Get user pokeball used
        const ball_mod = 255;
        const p0 = status_ailent / (ball_mod + 1);

        // TODO: Calculate this
        const f = calculateGenIF();
        console.log(`GenIF() = ${f}`);
        const p1 = ((captureRate + 1) / (ball_mod + 1)) * ((f + 1) / 256);
        console.log(`p0 = ${p0}, p1 = ${p1}`);
        return p0 + p1;
    }

    const calculateCaptureRate = (generation_name) => {
        try {
            const rate_calculators = {
                "generation-i": calculateGenICaptureRate
            }
            console.log(`Selected generation = ${generation_name}`);
            const rc = rate_calculators[generation_name]();
            console.log(`Rate calculated as ${rc}`);
            return rc;
        }
        catch (error) {
            console.log(error)
            NotificationManager.error(`${generation_name} is not a valid generation name`, "Calculation Error");
        }
    }

    const onCaptureGaugeError = (error) => {
        console.log(error);
        NotificationManager.error(`Error in the capture gauge: ${error}`);
    }

    const onStatusChange = (status) => {
        console.log(`New status = ${status}`);
    }

    const hasSelectedAGeneration = selectedGeneration != '';
    let selectedGenProp;
    if (hasSelectedAGeneration) {
        selectedGenProp = selectedGeneration;
    }

    return (
        <div>
            <ErrorBoundary onError={onGenericError}>
                <LabelledDropdown
                    className="ball-selector"
                    options={["Pokeball", "Greatball"]}
                    onChange={onSelectBall}
                    placeholder="Select a Ball Type" />
                <hr className="rule" />
                <LabelledDropdown
                    classname="pokemon-selector"
                    options={props.pokemon_names}
                    onChange={onSelectPokemon}
                    placeholder="Select a Pokemon" />
                <hr className="rule" />
                <CaptureGuage
                    classname="capture-gauge"
                    mon={selectedMon}
                    rate={captureRate}
                    onError={onCaptureGaugeError} />
                <hr className="rule" />
                <LabelledDropdown
                    classname="generation-selector"
                    options={props.generations}
                    onChange={onSelectGenerations}
                    placeholder="Select a Generation"
                />
                <hr className="rule" />
                <LabelledDropdown
                    classname='status-selector'
                    options={["none"]}
                    onChange={onStatusChange}
                    value={["none"]}
                />
                <hr className="rule" />
                <h1 className="probability">{captureProbability}</h1>
            </ErrorBoundary>
            <NotificationContainer />

        </div>)
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
        root.render(<App api={P} pokemon_names={pokemon.map(p => p.name)} generations={generations} />);
    } catch (error) {
        console.log("Error = ", error);
        NotificationManager.error("Unable to get either the pokemon list, or the generation list. Try refreshing the page");
        root.render(<NotificationContainer />);
    }
})()
