import PokemonList from './pokemon_list';
import Pokedex from 'pokedex-promise-v2';
import { imageListItemBarClasses } from '@mui/material';
jest.mock('pokedex-promise-v2');

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Pokedex.mockClear();
});

test('initialises', () => {
    const mockApi = new Pokedex();
    const uut = new PokemonList(mockApi);
    expect(uut.pokemonList.length).toBe(0);
    expect(uut.pageSize).toBe(30);
    expect(uut.api).toBe(mockApi);
    expect(uut.nextPage).toBe(0);
});

test('gets a page with right limit', () => {
    const mockApi = new Pokedex();
    const uut = new PokemonList(mockApi);
    const _ = uut.getCurrentPage();
    const mockPokedexInstance = Pokedex.mock.instances[0];
    const mockGetPokemonsList = mockPokedexInstance.getPokemonsList;
    expect(mockGetPokemonsList).toHaveBeenCalledTimes(1);
    expect(mockGetPokemonsList).toHaveBeenCalledWith({ "limit": uut.pageSize });
});

