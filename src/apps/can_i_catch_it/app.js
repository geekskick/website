import React from 'react';
import Pokedex from 'pokedex-promise-v2';
import ErrorBoundary from './../../components/error_boundary';
import Stack from '@mui/material/Stack'
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';
import ResultCard from './result_card';

export default function CanICatchItApp(props) {
    const [selectedPokemon, setSelectedPokemon] = React.useState('');
    const [selectedGeneration, setSelectedGeneration] = React.useState('');
    const api = React.useRef(new Pokedex());
    const [generations, setGenerations] = React.useState([]);
    const [pokemonNames, setPokemonNames] = React.useState([]);

    const onSelectPokemon = (mon) => {
        setSelectedPokemon(mon);
        props.info(`Selected ${mon}`);
    }

    const onSelectGenerations = (gen) => {
        setSelectedGeneration(gen);
        props.info(`Selected ${gen}`);
    }

    const allDataGathered = selectedGeneration !== '' && selectedPokemon !== '';

    const resultCard = (() => {
        if (allDataGathered) {
            return (
                <ResultCard
                    selectedPokemon={selectedPokemon}
                    selectedGeneration={selectedGeneration}
                    api={api.current}
                />
            );
        }
        else {
            return <div></div>
        }
    })();


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


    return (<ErrorBoundary onError={props.error}>
        {/* According to the docs the Stack is better for this, but it doesn't seem as easy to get the 
                    Dropdowns to actually fill the screen evenly, so for now specify using the xs property of the Grid item 
                    That things are going to take up 4 of the 12 available columns - aka be 1/3 of the screen each
                */}
        <Stack direction="row" spacing={2} sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Autocomplete
                sx={{
                    width: '100%'
                }}
                options={pokemonNames.map(key => { return { label: key } })}
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
            <Autocomplete
                sx={{
                    width: '100%'
                }}
                options={generations.map(gen => { return { label: gen } })}
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
        </Stack>
        {resultCard}
    </ErrorBoundary>);
}