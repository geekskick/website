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
import LinearProgress from '@mui/material/LinearProgress';
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import _ from "lodash";


function App(props) {
    console.log("App props = ", props);
    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [captureRate, setCaptureRate] = React.useState(0.0);
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [captureProbability, setCaptureProbability] = React.useState(0.0);
    const [selectedBall, setSelectedBall] = React.useState('');
    const [windowDimensions, setWindowDimensions] = React.useState(getWindowDimensions());
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [filteredPokemonOptions, setFilteredPokemonOptions] = React.useState([]);
    const [filteredBallOptions, setFilteredBallOptions] = React.useState([]);
    // 1151 here is the max number of pokemon, I need to pass this into the function via props
    const shinyIdx = React.useRef(getRandomInt(1151));
    const [results, setResults] = React.useState({});

    function handleWindowResize() {
        setWindowDimensions(getWindowDimensions());
    }

    const onGenericError = (error, info) => {
        NotificationManager.error(error + info);
    }

    const onSelectBall = (ball) => {
        console.log(`onSelectBall::ball = ${ball}`);
        setSelectedBall(ball);
        NotificationManager.info(`Selected ${ball.target.value}`);
    }

    const onSelectPokemon = (mon) => {
        console.log(`onSelect::mon = ${mon}`);
        setSelectedPokemon(mon.target.value);
        NotificationManager.info(`Selected ${mon.target.value}`);
    }

    const onSelectGenerations = (mon) => {
        console.log(`Selected = ${mon.target.value}`);
        setSelectedGeneration(mon.target.value);
        NotificationManager.info(`Selected ${mon.target.value}`);
    }

    const onStatusChange = (status) => {
        Notification.info(`New status = ${status}`);
    }

    /**
     * In the pokemonlist I want to make a random pokemon as shiny,
     * this is determined by the Reference 'shinyIdx' contents. 
     * There is an attribute in the pokemon to determin if it's shingy 
     * or not and simply sets it to true
     */
    const setRandomPokemonToShiny = () => {
        if (props.pokemonList.length >= shinyIdx.current) {
            props.pokemonList[shinyIdx.current].shiny = true;
        }
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

    setRandomPokemonToShiny();

    // TODO Remove all this shit and make the image dimensions as a percentage of the screen using css or something like that?
    const screenWidth = windowDimensions.width;
    const spriteWidth = calculateSpriteWidth(screenWidth);
    const rows = screenWidth / spriteWidth;

    console.log("With a width of ", screenWidth, " and a sprite dimension of ", spriteWidth, " I can fit ", rows, " in");
    console.log("Selected Pokemon = " + selectedPokemon);
    console.log("Ball list = ", props.ballList);
    console.log("Pokemonlist = ", props.pokemonList);

    const mainData = (() => {
        if (props.dataLoading) {
            return <div>
                <LinearProgress variant="determinate" value={props.percentageLoaded * 100} />
            </div>
        }
        else {
            return (
                <ErrorBoundary onError={onGenericError}>
                    {/* According to the docs the Stack is better for this, but it doesn't seem as easy to get the 
                    Dropdowns to actually fill the screen evenly, so for now specify using the xs property of the Grid item 
                    That things are going to take up 4 of the 12 available columns - aka be 1/3 of the screen each
                */}
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <LabelledDropdown
                                options={props.pokemonList.map(pokemon => pokemon.name)}
                                onChange={onSelectPokemon}
                                label="Select a Pokemon"
                                placeholder="Select a Pokemon"
                                value={selectedPokemon}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <LabelledDropdown
                                options={props.generations}
                                onChange={(event) => {
                                    console.log(event);
                                    onSelectGenerations(event.target.value);
                                }}
                                placeholder="Select a Generation"
                                label="Select a Generation"
                                value={selectedGeneration}
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
                    {/*<FilteringSpriteGallery
                        superSetSpriteList={props.pokemonList.filter(pokemon => {
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
                    />*/}
                    <hr className="rule" />
                    <hr className="rule" />
                    <h1 className="probability">{captureProbability}</h1>
                </ErrorBoundary>);
        }
    })();

    return (
        <div>
            <NavBar onAboutClick={handleAboutClick} />
            <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
            <hr className="rule" />
            {mainData}
            <NotificationContainer />
        </div >)
}

function AppView() {
    const api = React.useRef(new Pokedex());
    const pokemonListManager = React.useRef(new PokemonListManager(api.current));
    const [generations, setGenerations] = React.useState([]);
    const [statusOptions, setStatusOptions] = React.useState([]);
    const pokemonList = React.useRef([]);
    const [ballList, setBallList] = React.useState([]);
    const [dataLoading, setDataLoading] = React.useState(true);
    const [percentageLoaded, setPercentageLoaded] = React.useState(0.0);

    React.useEffect(() => {
        if (!pokemonListManager.current.allInformationGathered()) {
            pokemonListManager.current.getNextPage().then((newPage) => {
                console.log("Next page of pokemon is ", newPage);
                newPage.forEach(async pokemonOverview => {
                    const pokemonDetail = await (await fetch(pokemonOverview.url)).json();
                    const newPokemon = { name: pokemonOverview.name, detail: pokemonDetail };
                    pokemonList.current.push(newPokemon);
                });
                const progress = pokemonListManager.current.getPercentProgress();
                console.log("Page loaded, full ist = ", pokemonList);
                console.log("Progress = ", progress);
                setPercentageLoaded(progress);
            })
        }
        else {
            setDataLoading(false);
        }
    }, [percentageLoaded]);

    return <App
        pokemonList={pokemonList.current}
        generations={generations}
        statusOptions={statusOptions}
        ballList={ballList}
        dataLoading={dataLoading}
        percentageLoaded={percentageLoaded}
    />
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
        root.render(<AppView />);
    } catch (error) {
        console.log("Error = ", error);
        NotificationManager.error("Unable to get either the pokemon list, or the generation list. Try refreshing the page");
        root.render(<NotificationContainer />);
    }
})()
