
export default class PokemonListManager {
    constructor(api, pageSize = 30) {
        this._pageSize = pageSize;
        this._nextPage = 0;
        this.pokemonList = [];
        this._api = api;
        this.totalSize = 0;
        this._totalPages = 0;
    }

    getPercentProgress() {
        if (this._nextPage === null) {
            return 1;
        }
        else if (this._nextPage === 0) {
            return 0;
        }
        else {
            return (this._nextPage) / (this._totalPages);
        }
    }

    async getNextPage() {
        if (this._nextPage == null) {
            return;
        }
        const response = await this._api.getPokemonsList({
            "limit": this._pageSize,
            'offset': this._pageSize * this._nextPage
        });

        this.totalSize = response.count;
        this._totalPages = response.count / this._pageSize;

        console.log(response);
        this.pokemonList = this.pokemonList.concat(response.results);
        this._nextPage += 1;

        // End of the list - no more pages
        if (response.next == null) {
            this._nextPage = null;
        }
        return response.results;
    }

    allInformationGathered() {
        return this._nextPage == null;
    }
}