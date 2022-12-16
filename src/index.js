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
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Toolbar from '@mui/material/Toolbar';
import { CssBaseline } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import InfoIcon from '@mui/icons-material/Info';
const drawerWidth = 240;
function Sidebar(props) {
    const [aboutOpen, setAboutOpen] = React.useState(false);

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

    return (<Drawer
        sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
        }}
        variant="permanent"
        anchor="left"
    >
        <Toolbar />
        <List>
            <ListItemButton onClick={handleAboutClick}>
                <ListItemIcon>
                    <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
            </ListItemButton>
        </List>
        <Divider />
        <AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />
    </Drawer>);
}

function DismissButton(props) {
    return (<Button onClick={() => props.handleDismiss(props.key)}>Dismiss</Button>)
}

function App(props) {
    console.log("App props = ", props);
    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
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

    const onGenericError = (errorM, info) => {
        error(errorM + info);
    }

    const onSelectPokemon = (mon) => {
        setSelectedPokemon(mon);
        info(`Selected ${mon}`);
    }

    const onSelectGenerations = (gen) => {
        setSelectedGeneration(gen);
        info(`Selected ${gen}`);
    }


    const allDataGathered = selectedGeneration !== '' && selectedPokemon !== '';

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
                    api={props.api}
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
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                </Grid>
                <hr className="rule" />
                {probabilityData}
                <hr className="rule" />
                {resultCard}
            </ErrorBoundary>);
    })();

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <NavBar title={"Can I Catch It?"} width={`calc(100% - ${drawerWidth}px)`} />
            <Sidebar />
            {/*<AboutDialog open={aboutOpen} handleAboutClose={handleAboutClose} />*/}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3
                }}>
                <Toolbar />
                {mainData}
            </Box>
        </Box >)
}

function AppView() {

    const api = React.useRef(new Pokedex());
    const [generations, setGenerations] = React.useState([]);
    const [pokemonNames, setPokemonNames] = React.useState([]);



    React.useEffect(() => {

        console.log("Requesting Generations");
        api.current.getGenerationsList().then(generationsResults => {
            console.log("generationsResults = ", generationsResults);
            setGenerations(generationsResults.results.map(gen => gen.name));
        });

        api.current.getPokemonSpeciesList().then(speciesList => {
            console.log("speciesList = ", speciesList);
            setPokemonNames(speciesList.results.map(species => species.name));
        });


    }, []);

    console.log("pokemonNames = ", pokemonNames);
    console.log("generations = ", generations);
    return (
        <SnackbarProvider maxSnack={3}>
            <App
                pokemonNames={pokemonNames}
                generations={generations}
                api={api.current}
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
