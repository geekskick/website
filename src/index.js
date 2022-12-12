import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Pokedex from 'pokedex-promise-v2';
import 'react-dropdown/style.css';
import { ErrorBoundary } from './error_boundary';
import PokemonListManager from './pokemon_list_manager';
import NavBar from './navbar';
import AboutDialog from './about_dialog';
import Balls from './data/balls.json'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress';
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography';

function DismissButton(props) {
    return (<Button onClick={() => props.handleDismiss(props.key)}>Dismiss</Button>)
}

function App(props) {
    console.log("App props = ", props);
    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const [aboutOpen, setAboutOpen] = React.useState(false);
    const [selectedStatusAilment, setSelectedStatusAilment] = React.useState('');
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
        setSelectedStatusAilment(status);
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
                                options={props.pokemonList.map(pokemon => { return { label: `#${pokemon.detail.id} ${pokemon.name}` } })}
                                isOptionEqualToValue={(left, right) => { return left.label === right }}
                                onChange={(event, value, reason) => {
                                    console.log(event, value, reason);
                                    if (reason === "selectOption") {
                                        onSelectPokemon(value.label);
                                    }
                                }}
                                value={selectedPokemon}
                                renderInput={(params) => <TextField {...params} label="Select a Pokemon" />}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                options={props.generations.map(gen => { return { label: gen.name } })}
                                isOptionEqualToValue={(left, right) => { return left.label === right }}
                                onChange={(event, value, reason) => {
                                    console.log(event, value, reason);
                                    if (reason === "selectOption") {
                                        onSelectGenerations(value.label);
                                    }
                                }}
                                value={selectedGeneration}
                                renderInput={(params) => <TextField {...params} label="Select a Generation" />}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Autocomplete
                                options={props.statusOptions.map(option => { return { label: option.name } })}
                                isOptionEqualToValue={(left, right) => {
                                    return left.label === right
                                }}
                                onChange={(event, value, reason) => {
                                    console.log(event, value, reason);
                                    if (reason === "selectOption") {
                                        onStatusChange(value.label);
                                    }
                                }}
                                value={selectedStatusAilment}
                                renderInput={(params) => <TextField {...params} label="Select a Status Ailment" />}
                            />
                        </Grid>
                    </Grid>
                    <hr className="rule" />
                    {probabilityData}
                </ErrorBoundary>);
        }
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
    const api = React.useRef(new Pokedex());
    const pokemonListManager = React.useRef(new PokemonListManager(api.current));
    const generations = React.useRef([]);
    const statusOptions = React.useRef([]);
    const pokemonList = React.useRef([]);
    const ballList = React.useRef([]);
    const [dataLoading, setDataLoading] = React.useState(true);
    const [percentageLoaded, setPercentageLoaded] = React.useState(0.0);
    const ballsLoading = React.useRef(true);
    const ailmentsLoading = React.useRef(true);
    const speciesDataLoading = React.useRef(true);

    React.useEffect(() => {

        if (ballsLoading.current) {
            api.current.getGenerationsList().then(generationsResults => {
                console.log("Generations = ", generationsResults);
                generations.current = generationsResults.results;
                ballsLoading.current = false;
            });

            api.current.getPokemonSpeciesList().then(species => {
                console.log("Species: ", species);
            })
        }

        if (ailmentsLoading.current) {
            api.current.getMoveAilmentsList().then(ailments => {
                console.log("Ailments = ", ailments);
                statusOptions.current = ailments.results;
                ailmentsLoading.current = false;
            });
        }

        if (!pokemonListManager.current.allInformationGathered()) {
            api.current.getPokemonSpeciesList().then(speciesList => {
                const totalSpecies = speciesList.length;
                speciesList.results.forEach(species => {
                    api.current.getPokemonSpeciesByName(species.name).then(speciesDetail => {
                        pokemonList.current.push({ name: species.name, detail: speciesDetail });
                        const thisSpecies = speciesDetail.id;
                        setPercentageLoaded(thisSpecies / totalSpecies);
                    });
                })
                speciesDataLoading.current = false;
            });
        }
        if (!speciesDataLoading.current && !ballsLoading.current && !ailmentsLoading.current) {
            setDataLoading(false);
        }

    }, [percentageLoaded]);

    console.log(generations);
    return (
        <SnackbarProvider maxSnack={3}>
            <App
                pokemonList={pokemonList.current}
                generations={generations.current}
                statusOptions={statusOptions.current}
                ballList={ballList.current}
                dataLoading={dataLoading}
                percentageLoaded={percentageLoaded}
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
