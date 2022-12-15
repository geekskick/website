function getOrUseCached(key, getter) {
    let cachedValue = localStorage.getItem(key);
    if (!cachedValue) {
        getter(key, storeInCache);
        cachedValue = localStorage.getItem(key);
    }
    const parsedItem = JSON.parse(cachedValue);
    console.log(`The fetched item from localStorage for ${key} is `, parsedItem);
    return parsedItem;
}

export function getOrUseCachedSpeciesData(key, getter) {
    return getOrUseCached(`${key}_species`, getter);
}

export function getOrUseCachedPokemonData(key, getter) {
    return getOrUseCached(`${key}_detail`, getter);
}

function storeInCache(key, value) {
    const stringifiedValue = JSON.stringify(value);
    console.log(`Storing ${key} with `, stringifiedValue);
    localStorage.setItem(key, stringifiedValue);
}