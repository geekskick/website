import React from "react";

export class PokemonList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selected_mon: null, capture_rate: null }
    }
    async onSelect(mon) {
        this.props.on_select(mon.target.value)
    }
    render() {
        console.log("render::props = ", this.props);
        console.log("render::state = ", this.state);

        return (<div>
            <select onChange={this.onSelect.bind(this)}>
                <option value="Select a Pokemon"> -- Select a Pokemon -- </option>
                {this.props.names.map((mon) => <option key={mon} value={mon}>{mon}</option>)}
            </select>
        </div>

        );
    }

}