import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CaptureGuage } from './capture_gauge';
import Pokedex from 'pokedex-promise-v2';
import Dropdown from 'react-dropdown';
import 'reactjs-popup/dist/index.css';
import 'react-dropdown/style.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';



const P = new Pokedex();

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selected_mon: null,
            capture_rate: null,
            selected_generation: null,
            possible_generations: this.props.generations,
        }
    }

    async onSelectPokemon(mon) {
        console.log("onSelect::mon = ", mon);
        try {
            const prom = await this.props.api.getPokemonSpeciesByName(mon.value);
            console.log("onSelect::prom = ", prom);
            this.setState(previous_state => ({
                selected_generation: prom.generation.name,
                possible_generations: previous_state.possible_generations,
                selected_mon: mon.value,
                capture_rate: prom.capture_rate
            }));
        }
        catch (error) {
            console.log("onSelect::error = ", error);
            NotificationManager.error("Unable to get the details of pokemon species " + mon.value);
            this.setState(
                previous_state => ({
                    selected_generation: null,
                    possible_generations: previous_state.possible_generations,
                    selected_mon: null,
                    capture_rate: null
                })

            );
        }
    }

    onSelectGenerations(mon) {
        console.log("Selected = ", mon.value);
        this.setState(
            previous_state => ({
                selected_generation: mon.value.name,
                possible_generations: previous_state.possible_generations,
                selected_mon: previous_state.selected_mon,
                capture_rate: previous_state.capture_rate,
            })

        );
    }

    render() {
        console.log("App::render = ", this.state);


        return (<div style={{
            width: '50%'
        }}>
            <Dropdown 
                options={this.props.names}
                onChange={this.onSelectPokemon.bind(this)}
                value={this.state.selected_mon}
                placeholder="Select a Pokemon" />
            <CaptureGuage
                mon={this.state.selected_mon}
                rate={this.state.capture_rate} />
            <Dropdown options={this.props.generations}
                onChange={this.onSelectGenerations.bind(this)}
                value={this.state.selected_generation}
                placeholder="Select a Generation" />
            <NotificationContainer />
        </div>)
    }

}

async function getPokemonList(api) {
    const prom = await api.getPokemonsList({ limit: 1500 });
    return prom.results.map(p => p.name);
}

async function getGenerationsList(api) {
    const prom = await api.getGenerationsList();
    return prom.results.map(p => p.name);
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
(async () => {
    try {
        const names = await getPokemonList(P);
        const generations = await getGenerationsList(P);
        root.render(<App api={P} names={names} generations={generations} />);
    } catch (error) {
        console.log("Error = ", error);
        NotificationManager.error("Unable to get either the pokemon list, or the generation list. Try refreshing the page");
        root.render(<NotificationContainer />);
    }
})()
