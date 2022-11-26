import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { CaptureGuage  } from './capture_gauge';
import { PokemonList } from './pokemon_list';
import Pokedex from 'pokedex-promise-v2';

const P = new Pokedex();

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selected_mon: null,
            capture_rate: null
        }
    }

    async onSelect(mon) {
        console.log("onSelect::mon = ", mon);
        try {
            const prom = await this.props.api.getPokemonSpeciesByName(mon);
            console.log("onSelect::prom = ", prom);
            this.setState({
                selected_mon: mon,
                capture_rate: prom.capture_rate
            });
        }
        catch (error) {
            console.log("onSelect::error = ", error);
            this.setState({
                capture_rate: null,
                selected_mon: mon
            });
        }
    }

    render() {
        return (<div style={{width:250}}><PokemonList names={this.props.names} on_select={this.onSelect.bind(this)} />
            <CaptureGuage mon={this.state.selected_mon} rate={this.state.capture_rate}/>
        </div>)
    }

}

async function getPokemonList(api) {
    console.log("getPokemonList::api = ", api);
    const prom = await api.getPokemonsList({ limit: 1500 });
    console.log("getPokemonList::promise = ", prom);
    console.log("getPokemonList::prom = ", prom);
    console.log("getPokemonList:: returning");
    return prom.results.map(p => p.name);
}


// ========================================

(async () => {
    try {
        const names = await getPokemonList(P);
        console.log("names = ", names);
        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(<App api={P} names={names} />);
    } catch (error) {
        console.log("Error = ", error);
        throw error;
    }
})()
