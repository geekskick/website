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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { debounce } from "lodash"
import calculateCaptureRate from './calculations'
import PokemonImages from './pokemon_images'
import getWindowDimensions from './window_dimensions';
import NavBar from './navbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText } from '@mui/material';

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

    const _filterOptions = createFilterOptions();
    const debouncedSetFilteredOptions = React.useRef(
        debounce(criteria => {
            setFilteredOptions(criteria);
        }, 300)
    ).current;

    useEffect(() => {
        return () => {
            debouncedSetFilteredOptions.cancel();
        };
    }, [debouncedSetFilteredOptions]);
    const [filteredOptions, setFilteredOptions] = React.useState([]);
    const filterOptions = React.useCallback((options, state) => {
        console.log(options);
        console.log(state);
        const results = _filterOptions(options, state);
        // This callback gets called loads when the user has focus on the autocomplete box
        // so deboucing is needed here to prevent it all locking up
        debouncedSetFilteredOptions(results.map(option => option.id));
        return results;
    }, [_filterOptions, debouncedSetFilteredOptions]);


    const handleAboutClick = () => {
        setAboutOpen(true);
    }

    const handleAboutClose = () => {
        setAboutOpen(false);
    }

    console.log("Selected Pokemon = " + selectedPokemon);
    return (
        <div>
            <NavBar onAboutClick={handleAboutClick} />
            <Dialog onClose={handleAboutClose} open={aboutOpen}>
                <DialogTitle>About</DialogTitle>
                <DialogContentText>Hello</DialogContentText>
            </Dialog>
            <ErrorBoundary onError={onGenericError}>
                <Autocomplete
                    autoComplete
                    options={pokemonList.map(pokemon => {
                        return { label: pokemon.name, id: pokemon.name }
                    })}
                    filterOptions={filterOptions}
                    onChange={((event, newValue) => {
                        console.log(event);
                        debouncedSetFilteredOptions([newValue.id]);
                        onSelectPokemon(newValue.id);
                    })}


                    renderInput={(params) => <TextField {...params} label="Type to Select Pokemon" />}
                />
                <hr className="rule" />
                <PokemonImages pokemonList={pokemonList.filter(pokemon => {
                    const listExists = filteredOptions.length > 0;
                    if (!listExists) {
                        // If there's no filter list then we want to show the lot
                        return true;
                    }
                    return filteredOptions.includes(pokemon.name);

                })} dim={sprite_width} cols={rows} />
                <hr className="rule" />
                <LabelledDropdown
                    className="ball-selector"
                    options={["Pokeball", "Greatball"]}
                    onChange={onSelectBall}
                    placeholder="Select a Ball Type" />
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
