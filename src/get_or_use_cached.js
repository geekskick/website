export default function get_or_use_cached(key, getter) {
    let cachedValue = localStorage.getItem(key);
    if (!cachedValue) {
        const gotValue = getter();
        const stringifiedValue = JSON.stringify(gotValue);
        console.log(`Storing ${key} with `, stringifiedValue);
        localStorage.setItem(key, stringifiedValue);
        return get_or_use_cached(key, getter);
    }
    const parsedItem = JSON.parse(cachedValue);
    console.log(`The fetched item from localStorage for ${key} is `, parsedItem);
    return parsedItem;
}