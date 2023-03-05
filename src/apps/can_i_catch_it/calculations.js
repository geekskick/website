import { calculateHpMax } from './calculations/hp_max';


function calculateModifiedCatchRateGenV(captureRate,
    ballSettings,
    pokemonHpStat,
    pokemonLevel,
    hp,
    status,
    valueCallbacks) {
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    valueCallbacks.setHpCurrent(hpCurrent);
    valueCallbacks.setBallModifier(ballSettings.ballMod);

    const darkGrass = 0.5;
    const passPower = 1;

    valueCallbacks.setDarkGrass(darkGrass);
    valueCallbacks.setAilment(1);
    valueCallbacks.setPassPower(1);
    valueCallbacks.setDarkGrass(darkGrass);
    const hpMaxTimes3 = 3 * hpMax;
    const hpCurrentTimes2 = 2 * hpCurrent;
    let top;
    try {
        top = (hpMaxTimes3 - hpCurrentTimes2) * 4096 * darkGrass * captureRate * ballSettings.ballMod;
    } catch (err) {
        throw new Error('No ball modifier available');
    }

    const bottom = hpMaxTimes3;
    const fraction = top / bottom;
    // TODO: take into account status changes
    return fraction * passPower;
}

export function calculateGenVCaptureProbability(captureRate,
    ballSettings,
    pokemonHpStat,
    pokemonLevel,
    hp,
    statusAilment,
    valueCallbacks) {
    const a = calculateModifiedCatchRateGenV(captureRate,
        ballSettings,
        pokemonHpStat,
        pokemonLevel,
        hp,
        statusAilment,
        valueCallbacks);
    valueCallbacks.setA(a);
    if (a >= 1044480) {
        return 1;
    }
    // TODO: what is this value?
    return a / (255 * 4096);
}

