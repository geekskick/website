import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Pokedex from 'pokedex-promise-v2';
import LabelledDropdown from './labelled_dropdown';
import 'react-dropdown/style.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ErrorBoundary } from './error_boundary';
import PokemonListManager from './pokemon_list_manager';
import calculateCaptureRate from './calculations'
import FilteringSpriteGallery from './filtering_sprite_gallery'
import getWindowDimensions from './window_dimensions';
import NavBar from './navbar';
import AboutDialog from './about_dialog';
import FilteringAutocomplete from './filtering_autocomplete';
import Balls from './data/balls.json'
import Grid from '@mui/material/Grid'

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import _ from "lodash";
const P = new Pokedex();

function App(props) {

    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [captureRate, setCaptureRate] = React.useState(0.0);
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [captureProbability, setCaptureProbability] = React.useState(0.0);
    const [selectedBall, setSelectedBall] = React.useState('');
    const [pokemonList, setPokemonList] = React.useState(props.pokemonListManager.pokemonList);
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [filteredPokemonOptions, setFilteredPokemonOptions] = React.useState([]);
    const [filteredBallOptions, setFilteredBallOptions] = React.useState([]);
    const [ballList, setBallList] = React.useState([]);
    const shinyIdx = React.useRef(getRandomInt(pokemonList.length));
    const [results, setResults] = React.useState({});

    function handleWindowResize() {
        setWindowDimensions(getWindowDimensions());
    }

    const getBallList = async () => {
        const _ballList = [];
        console.log("Getting the ball list");
        const balls = await props.api.getItemPocketByName("pokeballs");
        await balls.categories.forEach(async element => {
            const specificBalls = await (await fetch(element.url)).json();
            specificBalls.items.forEach(async element => {
                const ball = await (await fetch(element.url)).json();
                _ballList.push({
                    name: ball.name,
                    sprite: { url: ball.sprites.default },
                    calculationData: Balls[ball.name] // Supplement the catch rate into the list from my static data too
                });
            })
        });
        setBallList(_ballList);
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
            // now that I have all this upfront I can remove this fetch
            const prom = await props.api.getPokemonSpeciesByName(mon);
            console.log(`onSelect::prom = ${prom}`);
            setSelectedGeneration(prom.generation.name);
            setCaptureRate(prom.capture_rate);
        }
        catch (error) {
            console.log("onSelect::error = ", error);
            NotificationManager.error(`Unable to get the details of pokemon species ${mon}`);
            setSelectedGeneration(null);
            setSelectedPokemon(null);
            setCaptureRate(null);
        }
    }

    const onSelectGenerations = (mon) => {
        console.log(`Selected = ${mon.target.value}`);
        NotificationManager.info(`Selected ${mon.target.value}`);
        setSelectedGeneration(mon.target.value);
    }

    const onStatusChange = (status) => {
        Notification.info(`New status = ${status}`);
    }

    /**
     * The pokemon data is really important so we need to get it.
     * First though we need to make sure that the pokemon has a .url attrbitute
     * so that we know where to get this from. 
     * @param {Number} idx The index into the pokemonList to use to find the url
     * @returns 
     */
    const getPokemonData = async (idx) => {
        const url = pokemonList[idx].url;
        const response = await fetch(url);
        return await response.json();
    }

    /**
     * The specied data is really important so we need to get it.
     * First though we need to make sure that the pokemon has a .data.species.url atributes
     * so that we know where to get this from. We need to make sure that `getPokemonData`
     * is called, and fulfilled first.
     * @param {Number} idx The index into the pokemonList to use to find the url
     * @returns 
     */
    const getPokemonSpeciesData = async (idx) => {
        const url = pokemonList[idx].data?.species.url;
        const response = await fetch(url);
        return await response.json();
    }

    /**
     * The pokemon has a heap of data associated with it, so 
     * here I use the pokemon name to get the details. I store all of 
     * this data alongside the pokemon name in it's .data and .species 
     * attributes. This additionally sets all pokemon to non shiny
     */
    const ensurePokemonListHasData = () => {
        if (!props.pokemonListManager.hasData) {
            console.log("Loading sprite urls");
            pokemonList.map(async (pokemon, idx) => {
                pokemon.data = await getPokemonData(idx);
                pokemon.species = await getPokemonSpeciesData(idx);
                pokemon.shiny = false;
            });
            props.pokemonListManager.hasData = true;
        }
    }

    /**
     * In the pokemonlist I want to make a random pokemon as shiny,
     * this is determined by the Reference 'shinyIdx' contents. 
     * There is an attribute in the pokemon to determin if it's shingy 
     * or not and simply sets it to true
     */
    const setRandomPokemonToShiny = () => {
        pokemonList[shinyIdx.current].shiny = true;
    }


    /**
     * The about window uses a single state variable to indicate if it's open or not.
     * This sets that variable to true, thus opening the window on the next render
     */
    const handleAboutClick = () => {
        setAboutOpen(true);
    }

    /**
     * The about window uses a single state variable to indicate if it's open or not.
     * This sets that variable to false, thus closing the window on the next render
     */
    const handleAboutClose = () => {
        setAboutOpen(false);
    }

    /**
     * The list sent to the SpriteGallery is expected to contain objects with the attributes,
     * { name, sprite {url, shiny}, id, tooltip }
     * so we need to change the shape of the data in the pokemonlist to fit. This method takes a single 
     * pokemon and returns a new object with the data in the right place for that component
     * @param {*} pokemon a pokemon
     * @returns object with data in expected format for the sprite gallery
     */
    const massagePokemonToFitIntoThePokemonImageList = (pokemon) => {
        return {
            name: pokemon.name,
            sprite: {
                url: pokemon.shiny ? pokemon.data?.sprites.front_shiny : pokemon.data?.sprites.front_default,
                shiny: pokemon.shiny
            },
            id: pokemon.data?.id,
            tooltip: pokemon.species?.flavor_text_entries.filter(entry => {
                return entry.language.name === "en"
            })[0].flavor_text.replace('\f', '\n')
        }
    }

    /**
     * Calculates the sprite based on the screen width. Currently
     * this is a proportion of the screen (20%), or 164 pixels. Whichever is largest
     * @param {Number} screenWidth The screen width in pixels
     * @returns 
     */
    const calculateSpriteWidth = (screenWidth) => {
        return Math.max(0.2 * screenWidth, 164);
    }

    if (ballList.length === 0) {
        getBallList();
    }

    ensurePokemonListHasData();
    setRandomPokemonToShiny();

    // TODO Remove all this shit and make the image dimensions as a percentage of the screen using css or something like that?
    const screenWidth = windowDimensions.width;
    const spriteWidth = calculateSpriteWidth(screenWidth);
    const rows = screenWidth / spriteWidth;

    console.log("With a width of ", screenWidth, " and a sprite dimension of ", spriteWidth, " I can fit ", rows, " in");
    console.log("Selected Pokemon = " + selectedPokemon);
    console.log("Ball list = ", ballList);
    console.log("Pokemonlist = ", pokemonList);
    return (
        <div>
            <NavBar onAboutClick={handleAboutClick} />
            <hr className="rule" />
            <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
            <ErrorBoundary onError={onGenericError}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FilteringAutocomplete
                            optionsSuperSet={pokemonList.map(pokemon => {
                                return { label: pokemon.name, id: pokemon.name }
                            })}
                            filteredOptions={filteredPokemonOptions}
                            onSelect={onSelectPokemon}
                            onNewFilteredList={(list) => { setFilteredPokemonOptions(list) }}
                            label="Type to Select Pokemon"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            autoComplete
                            isOptionEqualToValue={_.isEqual}
                            options={props.generations}
                            onChange={(_, newValue) => {
                                onSelectGenerations(newValue.id);
                            }}
                            renderInput={(params) => <TextField {...params} label={"Select a Generation"} />}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            autoComplete
                            isOptionEqualToValue={_.isEqual}
                            options={props.statusOptions}
                            onChange={(_, newValue) => {
                                onStatusChange(newValue.id);
                            }}
                            renderInput={(params) => <TextField {...params} label={"Select a Status Ailment"} />}
                        />
                    </Grid>
                </Grid>
                <hr className="rule" />
                <FilteringSpriteGallery
                    superSetSpriteList={pokemonList.filter(pokemon => {
                        const listExists = filteredPokemonOptions.length > 0;
                        if (!listExists) {
                            // If there's no filter list then we want to show the lot
                            return true;
                        }
                        return filteredPokemonOptions.includes(pokemon.name);
                    }).map(pokemon => massagePokemonToFitIntoThePokemonImageList(pokemon))}
                    dimension={spriteWidth}
                    columns={rows}
                    rows={3}
                />
                <hr className="rule" />
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
        root.render(<App api={P} pokemonListManager={plm} generations={generations} statusOptions={[]} />);
    } catch (error) {
        console.log("Error = ", error);
        NotificationManager.error("Unable to get either the pokemon list, or the generation list. Try refreshing the page");
        root.render(<NotificationContainer />);
    }
})()
