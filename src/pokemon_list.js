export default class PokemonList {
    constructor(api, pageSize = 30,) {
        this.pageSize = pageSize;
        this.nextPage = 0;
        this.pokemonList = [];
        this.api = api;
    }
    async getCurrentPage() {
        this.pokemonList += await this.api.getPokemonsList({ "limit": this.pageSize });
    }
}