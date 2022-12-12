import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Pokedex from 'pokedex-promise-v2';
import 'react-dropdown/style.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { ErrorBoundary } from './error_boundary';
import PokemonListManager from './pokemon_list_manager';
import NavBar from './navbar';
import AboutDialog from './about_dialog';
import Balls from './data/balls.json'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import _ from "lodash";


function App(props) {
    console.log("App props = ", props);
    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [selectedBall, setSelectedBall] = React.useState('');
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [selectedStatusAilment, setSelectedStatusAilment] = React.useState('');
    const [captureProbability, setCaptureProbability] = React.useState({ possible: false, probability: 0.0 });

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
        setSelectedPokemon(mon);
        NotificationManager.info(`Selected ${mon}`);
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
                            <Autocomplete
                                autoComplete
                                options={props.pokemonList.map(pokemon => pokemon.name)}
                                onChange={(event, value, reason) => {
                                    console.log(event, value, reason);
                                    if (reason === "selectOption") {
                                        onSelectPokemon(value);
                                    }
                                }}
                                isOptionEqualToValue={(left, right) => { return left.name === right.name; }}
                                value={selectedPokemon}
                                renderInput={(params) => <TextField {...params} label="Select a Pokemon" />}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                autoComplete
                                options={props.generations}
                                onChange={(event, value, reason) => {
                                    console.log(event, value, reason);
                                    if (reason === "selectOption") {
                                        onSelectGenerations(value);
                                    }
                                }}
                                value={selectedGeneration}
                                renderInput={(params) => <TextField {...params} label="Select a Generation" />}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                autoComplete
                                options={props.statusOptions}
                                onChange={(event, value, reason) => {
                                    console.log(event, value, reason);
                                    if (reason === "selectOption") {
                                        onStatusChange(value);
                                    }
                                }}
                                value={selectedStatusAilment}
                                renderInput={(params) => <TextField {...params} label="Select a Status Ailment" />}
                            />
                        </Grid>
                    </Grid>
                    <hr className="rule" />
                    <h1 className="probability">{captureProbability.probability}</h1>
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
    }
})()
