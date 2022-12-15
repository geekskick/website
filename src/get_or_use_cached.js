async function getOrUseCached(key, getter) {
    let cachedValue = localStorage.getItem(key);
    if (!cachedValue) {
        await getter(key, storeInCache);
        console.log("used getter");
        cachedValue = localStorage.getItem(key);
    }
    const parsedItem = JSON.parse(cachedValue);
    console.log(`The fetched item from localStorage for ${key} is `, parsedItem);
    return parsedItem;
}

export function getOrUseCachedSpeciesData(key, getter, setter) {
    getOrUseCached(`${key}_species`, getter).then(value => {
        console.log("Calling ", setter, value);
        setter(value);
    });
}

export function getOrUseCachedPokemonData(key, getter, setter) {
    getOrUseCached(`${key}_detail`, getter).then(value => {
        console.log("value = ", value);
        setter(value);
    })
}

function storeInCache(key, value) {
    const stringifiedValue = JSON.stringify(value);
    console.log(`Storing ${key} with `, stringifiedValue);
    localStorage.setItem(key, stringifiedValue);
}