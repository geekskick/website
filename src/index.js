import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Pokedex from 'pokedex-promise-v2';
import 'react-dropdown/style.css';
import { ErrorBoundary } from './error_boundary';
import NavBar from './navbar';
import AboutDialog from './about_dialog';
import Balls from './data/balls.json'
import Grid from '@mui/material/Grid'
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';
import ResultCard from './result_card';

function DismissButton(props) {
    return (<Button onClick={() => props.handleDismiss(props.key)}>Dismiss</Button>)
}

function App(props) {
    console.log("App props = ", props);
    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [selectedAilment, setSelectedAilment] = React.useState('');
    const [captureProbability, setCaptureProbability] = React.useState({ possible: false, probability: 0.0 });
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const error = (message) => {
        console.log("errro: ", message);
        enqueueSnackbar(
            message,
            {
                key: Math.random(),
                variant: 'error',
                action: key => { return <DismissButton handleDismiss={closeSnackbar} key={key} /> }
            });
    };

    const info = (message) => {
        console.log("info: ", message);
        enqueueSnackbar(
            message,
            {
                key: Math.random(),
                variant: 'info',
                action: key => { return <Button onClick={() => closeSnackbar(key)}>Dismiss</Button> }
            });
    }

    const onGenericError = (error, info) => {
        error(error + info);
    }

    const onSelectPokemon = (mon) => {
        setSelectedPokemon(mon);
        info(`Selected ${mon}`);
    }

    const onSelectGenerations = (gen) => {
        setSelectedGeneration(gen);
        info(`Selected ${gen}`);
    }

    const onStatusChange = (status) => {
        info(`Selected ${status}`);
        setSelectedAilment(status);
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

    const allDataGathered = selectedGeneration !== '' && selectedPokemon !== '' && selectedAilment !== '';

    const probabilityData = (() => {
        if (captureProbability.possible) {
            return <div>
                <Typography>{captureProbability.probability}</Typography>
            </div>;
        }
        else {
            return <div></div>;
        }
    })();

    const resultCard = (() => {
        if (allDataGathered) {
            return (
                <ResultCard
                    selectedPokemon={selectedPokemon}
                    selectedGeneration={selectedGeneration}
                    selectedAilment={selectedAilment}
                />
            );
        }
        else {
            return <div></div>
        }
    })();

    const mainData = (() => {
        return (
            <ErrorBoundary onError={onGenericError}>
                {/* According to the docs the Stack is better for this, but it doesn't seem as easy to get the 
                    Dropdowns to actually fill the screen evenly, so for now specify using the xs property of the Grid item 
                    That things are going to take up 4 of the 12 available columns - aka be 1/3 of the screen each
                */}
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={props.pokemonNames.map(key => { return { label: key } })}
                            isOptionEqualToValue={(left, right) => { return left.label === right.label }}
                            onChange={(event, value, reason) => {
                                console.log(event, value, reason);
                                if (reason === "selectOption") {
                                    onSelectPokemon(value.label);
                                }
                            }}
                            value={{ label: selectedPokemon }}
                            renderInput={(params) => <TextField {...params} label="Select a Pokemon" />}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={props.generations.map(gen => { return { label: gen } })}
                            isOptionEqualToValue={(left, right) => { return left.label === right.label }}
                            onChange={(event, value, reason) => {
                                console.log(event, value, reason);
                                if (reason === "selectOption") {
                                    onSelectGenerations(value.label);
                                }
                            }}
                            value={{ label: selectedGeneration }}
                            renderInput={(params) => <TextField {...params} label="Select a Generation" />}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={props.ailments.map(option => { return { label: option } })}
                            isOptionEqualToValue={(left, right) => {
                                return left.label === right.label
                            }}
                            onChange={(event, value, reason) => {
                                console.log(event, value, reason);
                                if (reason === "selectOption") {
                                    onStatusChange(value.label);
                                }
                            }}
                            value={{ label: selectedAilment }}
                            renderInput={(params) => <TextField {...params} label="Select a Status Ailment" />}
                        />
                    </Grid>
                </Grid>
                <hr className="rule" />
                {probabilityData}
                <hr className="rule" />
                {resultCard}
            </ErrorBoundary>);
    })();

    return (
        <div>
            <NavBar onAboutClick={handleAboutClick} />
            <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
            <hr className="rule" />
            {mainData}
        </div >)
}

function AppView() {
    class DataToLoad {
        static Generations = new DataToLoad('Generations');
        static PokemonNames = new DataToLoad('PokemonNames');
        static Ailments = new DataToLoad('Ailments');

        constructor(name) {
            this._name = name;
        }

        toString() {
            return `DataToLoad.${this._name}`;
        }
    };

    const api = React.useRef(new Pokedex());
    const [generations, setGenerations] = React.useState([]);
    const [ailments, setAilments] = React.useState([]);
    const [pokemonNames, setPokemonNames] = React.useState([]);
    const dataRequests = React.useRef([]);

    const isLoading = (data) => {
        return dataRequests.current.some(item => data._name === item._name);
    }

    const startedLoading = (data) => {
        dataRequests.current.push(data);
    }

    React.useEffect(() => {
        console.log("useEffect");
        if (!isLoading(DataToLoad.Generations)) {
            startedLoading(DataToLoad.Generations);
            console.log("Requesting Generations");
            api.current.getGenerationsList().then(generationsResults => {
                console.log("generationsResults = ", generationsResults);
                setGenerations(generationsResults.results.map(gen => gen.name));
            });

        }

        if (!isLoading(DataToLoad.Ailments)) {
            startedLoading(DataToLoad.Ailments);
            console.log("Requesting Ailments");
            api.current.getMoveAilmentsList().then(ailmentsList => {
                console.log("ailments = ", ailmentsList);
                setAilments(ailmentsList.results.map(a => a.name));
            });
        }

        if (!isLoading(DataToLoad.PokemonNames)) {
            startedLoading(DataToLoad.PokemonNames);
            console.log("Requesting PokemonNames");
            api.current.getPokemonSpeciesList().then(speciesList => {
                console.log("speciesList = ", speciesList);
                setPokemonNames(speciesList.results.map(species => species.name));
            });
        }

    }, [DataToLoad.Generations, DataToLoad.Ailments, DataToLoad.PokemonNames]);

    console.log("pokemonNames = ", pokemonNames);
    console.log("generations = ", generations);
    console.log("ailments = ", ailments);
    return (
        <SnackbarProvider maxSnack={3}>
            <App
                pokemonNames={pokemonNames}
                generations={generations}
                ailments={ailments}
            />
        </SnackbarProvider>);
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
