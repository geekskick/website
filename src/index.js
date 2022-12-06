import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CaptureGuage } from './capture_gauge';
import Pokedex from 'pokedex-promise-v2';
import LabelledDropdown from './dropdown';
import 'react-dropdown/style.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ErrorBoundary } from './error_boundary';
import PokemonListManager from './pokemon_list_manager';
import calculateCaptureRate from './calculations'
import PokemonImages from './pokemon_images'
import getWindowDimensions from './window_dimensions';
import NavBar from './navbar';
import AboutDialog from './about_dialog';
import FilteringAutocomplete from './filtering_autocomplete';

const P = new Pokedex();

function App(props) {

    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [captureRate, setCaptureRate] = React.useState(0.0);
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [possibleGenerations, setPossibleGenerations] = React.useState('');
    const [captureProbability, setCaptureProbability] = React.useState(0.0);
    const [selectedBall, setSelectedBall] = React.useState('');
    const [pokemonList, setPokemonList] = React.useState(props.pokemonListManager.pokemonList);
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [filteredPokemonOptions, setFilteredPokemonOptions] = React.useState([]);
    const [filteredBallOptions, setFilteredBallOptions] = React.useState([]);
    const [ballList, setBallList] = React.useState([]);


    const getBallList = async () => {
        const _ballList = [];
        console.log("Getting the ball list");
        const balls = await props.api.getItemPocketByName("pokeballs");
        await balls.categories.forEach(async element => {
            const specificBalls = await (await fetch(element.url)).json();
            specificBalls.items.forEach(async element => {
                const ball = await (await fetch(element.url)).json();
                console.log("Setting ballList with", ball);
                _ballList.push({ name: ball.name, sprite: ball.sprites.default });
            })
        });
        setBallList(_ballList);
    }
    if (ballList.length === 0) {
        getBallList();
    }


    const onGenericError = (error, info) => {
        NotificationManager.error(error + info);
    }

    const onSelectBall = (ball) => {
        console.log(`onSelectBall::ball = ${ball}`);
        setSelectedBall(ball);
        NotificationManager.info(`Selected ${ball.target.value}`);
    }

    const onSelectPokemon = async (mon) => {
        console.log(`onSelect::mon = ${mon}`);
        NotificationManager.info(`Selected ${mon}`);
        try {
            const prom = await props.api.getPokemonSpeciesByName(mon);
            console.log(`onSelect::prom = ${prom}`);
            setSelectedGeneration(prom.generation.name);
            setCaptureRate(prom.capture_rate);
            setCaptureProbability(calculateCaptureRate(prom.generation.name, prom.capture_rate));
        }
        catch (error) {
            console.log("onSelect::error = ", error);
            NotificationManager.error(`Unable to get the details of pokemon species ${mon}`);
            setSelectedGeneration(null);
            setSelectedPokemon(null);
            setCaptureRate(null);
            setCaptureProbability(null);
        }
    }

    const onSelectGenerations = (mon) => {
        console.log(`Selected = ${mon.target.value}`);
        NotificationManager.info(`Selected ${mon.target.value}`);
        setSelectedGeneration(mon.target.value);
        setCaptureProbability(calculateCaptureRate(mon.target.value, captureRate));
    }


    const onCaptureGaugeError = (error) => {
        console.log(error);
        NotificationManager.error(`Error in the capture gauge: ${error}`);
    }

    const onStatusChange = (status) => {
        console.log(`New status = ${status}`);
    }

    const getPokemonSprite = async (idx) => {
        const url = pokemonList[idx].url;
        const response = await fetch(url);
        const json = await response.json();
        //console.log("Response from " + url + " was " + json);
        return json.sprites.front_default;
    }

    const ensurePokemonListHasSprites = () => {
        if (!props.pokemonListManager.hasSprites) {
            console.log("Loading sprite urls");
            pokemonList.map(async (pokemon, idx) => {
                pokemon.sprite = await getPokemonSprite(idx);
            });
            props.pokemonListManager.hasSprites = true;
        }
    }

    ensurePokemonListHasSprites();
    const width = windowDimensions.width;
    const sprite_width = Math.max(0.2 * width, 164);
    const rows = width / sprite_width;
    console.log("With a width of ", width, " and a sprite dimension of ", sprite_width, " I can fit ", rows, " in");



    const handleAboutClick = () => {
        setAboutOpen(true);
    }

    const handleAboutClose = () => {
        setAboutOpen(false);
    }

    console.log("Selected Pokemon = " + selectedPokemon);
    console.log("Ball list = ", ballList);
    return (
        <div>
            <NavBar onAboutClick={handleAboutClick} />
            <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
            <ErrorBoundary onError={onGenericError}>
                <FilteringAutocomplete
                    optionsSuperSet={pokemonList.map(pokemon => {
                        return { label: pokemon.name, id: pokemon.name }
                    })}
                    filteredOptions={filteredPokemonOptions}
                    onSelect={onSelectPokemon}
                    onNewFilteredList={(list) => { setFilteredPokemonOptions(list) }}
                    label="Type to Select Pokemon"
                />
                <hr className="rule" />
                <PokemonImages pokemonList={pokemonList.filter(pokemon => {
                    const listExists = filteredPokemonOptions.length > 0;
                    if (!listExists) {
                        // If there's no filter list then we want to show the lot
                        return true;
                    }
                    return filteredPokemonOptions.includes(pokemon.name);

                })} dim={sprite_width} cols={rows} />
                <hr className="rule" />
                <FilteringAutocomplete
                    optionsSuperSet={ballList.map(ball => {
                        return { label: ball.name, id: ball.name }
                    })}
                    filteredOptions={filteredBallOptions}
                    onNewFilteredList={(list) => { setFilteredBallOptions(list) }}
                    onSelect={onSelectBall}
                    label="Type to Select Pokeball"
                />
                <hr className="rule" />
                <PokemonImages pokemonList={ballList.filter(ball => {
                    const listExists = filteredBallOptions.length > 0;
                    if (!listExists) {
                        // If there's no filter list then we want to show the lot
                        return true;
                    }
                    return filteredBallOptions.includes(ball.name);

                })} dim={sprite_width} cols={rows} />
                <hr className="rule" />
                <CaptureGuage
                    classname="capture-gauge"
                    mon={selectedPokemon}
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
        </div >)
}



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function getGenerationsList(api) {
    const prom = await api.getGenerationsList();
    return prom.results.map(p => p.name);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
(async () => {
    try {
        const generations = await getGenerationsList(P);
        const plm = new PokemonListManager(P);
        await plm.getNextPage();
        root.render(<App api={P} pokemonListManager={plm} generations={generations} />);
    } catch (error) {
        console.log("Error = ", error);
        NotificationManager.error("Unable to get either the pokemon list, or the generation list. Try refreshing the page");
        root.render(<NotificationContainer />);
    }
})()
