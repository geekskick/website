import PokemonList from './pokemon_list_manager';
import Pokedex from 'pokedex-promise-v2';
jest.mock('pokedex-promise-v2');

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Pokedex.mockClear();
});

test('initialises', () => {
    const mockApi = new Pokedex();
    const uut = new PokemonList(mockApi);
    expect(uut.pokemonList.length).toBe(0);
    expect(uut._pageSize).toBe(30);
    expect(uut._api).toBe(mockApi);
    expect(uut._nextPage).toBe(0);
});

test('gets a page with right limit then moves to the next page', async () => {
    const mockApi = new Pokedex();
    const uut = new PokemonList(mockApi);
    const mockPokedexInstance = Pokedex.mock.instances[0];

    mockPokedexInstance.getPokemonsList = jest.fn((settings) => { return { "results": ["hello"], "next": null } });
    const mockGetPokemonsList = mockPokedexInstance.getPokemonsList;

    const _ = await uut.getNextPage();
    expect(mockGetPokemonsList).toHaveBeenCalledTimes(1);
    expect(mockGetPokemonsList).toHaveBeenCalledWith({ "limit": uut._pageSize, "offset": 0 });
    expect(uut._nextPage).toBe(null);
    expect(uut.pokemonList.length).toBe(1);
    expect(uut.pokemonList).toStrictEqual(['hello']);
    expect(uut.allInformationGathered()).toBe(true);
});

test('gets next page when its already got one', async () => {
    const mockApi = new Pokedex();
    const uut = new PokemonList(mockApi);
    const mockPokedexInstance = Pokedex.mock.instances[0];

    mockPokedexInstance.getPokemonsList = jest.fn((settings) => { return { "results": ["hello"], "next": '' } });
    await uut.getNextPage();
    mockPokedexInstance.getPokemonsList = jest.fn((settings) => { return { "results": ["world"], "next": null } });
    await uut.getNextPage();

    const mockGetPokemonsList = mockPokedexInstance.getPokemonsList;

    // This is only 1 since we reset the mock after it was called the first time
    expect(mockGetPokemonsList).toHaveBeenCalledTimes(1);
    expect(mockGetPokemonsList).toHaveBeenCalledWith({ "limit": uut._pageSize, 'offset': uut._pageSize });
    expect(uut._nextPage).toBe(null);
    expect(uut.pokemonList.length).toBe(2);
    expect(uut.pokemonList).toStrictEqual(['hello', 'world']);
});

test('gets next page stops when no next page present', async () => {
    const mockApi = new Pokedex();
    const uut = new PokemonList(mockApi);
    const mockPokedexInstance = Pokedex.mock.instances[0];

    mockPokedexInstance.getPokemonsList = jest.fn((settings) => { return { "results": ["world"], "next": null } });
    await uut.getNextPage();
    await uut.getNextPage();

    const mockGetPokemonsList = mockPokedexInstance.getPokemonsList;
    // There was null in the 'next' so we only expect the method to have gone out to the api 1 time
    expect(mockGetPokemonsList).toHaveBeenCalledTimes(1);
    expect(mockGetPokemonsList).toHaveBeenCalledWith({ "limit": uut._pageSize, 'offset': 0 });
    expect(uut._nextPage).toBe(null);
    expect(uut.pokemonList.length).toBe(1);
    expect(uut.pokemonList).toStrictEqual(['world']);
});

