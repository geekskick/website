
export default class PokemonListManager {
    constructor(api, pageSize = 30) {
        this._pageSize = pageSize;
        this._nextPage = 0;
        this.pokemonList = [];
        this._api = api;
    }

    async getNextPage() {
        if (this._nextPage == null) {
            return;
        }
        const response = await this._api.getPokemonsList({
            "limit": this._pageSize,
            'offset': this._pageSize * this._nextPage
        });

        console.log(response);
        this.pokemonList = this.pokemonList.concat(response.results);
        this._nextPage += 1;

        // End of the list - no more pages
        if (response.next == null) {
            this._nextPage = null;
        }
        return this.pokemonList;
    }

    allInformationGathered() {
        return this._nextPage == null;
    }
}