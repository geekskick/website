
export function calculateHpMax(pokemonHpStat, pokemonLevel) {
    console.log(`calculateHpMax(${pokemonHpStat}, ${pokemonLevel})`);
    // https://pokemon.neoseeker.com/wiki/HP#HP
    // Gen i and ii calculation:
    // (((IV + Base + (√EV / 8) + 50) * Level) / 50) + 10
    // e.g. raticate stat = 55, lvl 50.. ignore IV and EV gives:
    // (((IV + Base + (√EV / 8) + 50) * Level) / 50) + 10
    // (((Base + 50) * Level) / 50) + 10
    // (((55+50) * 50)/50) + 10
    // (((105  ) * 50)/50) + 10
    // ( 5250         /50) + 10
    // 105                 + 10 = 115
    return (((pokemonHpStat + 50) * pokemonLevel) / 50) + 10;
}
