import { calculateHpMax } from './hp_max';

function calculateModifiedCatchRateGenIII(
    captureRate,
    ballSettings,
    pokemonHpStat,
    pokemonLevel,
    hp,
    statusAilment,
    valueCallbacks) {
    const hpMax = Math.floor(calculateHpMax(pokemonHpStat, pokemonLevel));
    valueCallbacks?.setHpMax(hpMax);
    const hpCurrent = Math.floor(hpMax * hp);
    valueCallbacks?.setBallModifier(ballSettings.ballMod);
    valueCallbacks?.setHpCurrent(hpCurrent);
    const bonusStatus = 1;
    valueCallbacks?.setAilment(bonusStatus);
    const hpMaxTimes3 = Math.floor(3 * hpMax);
    const hpCurrentTimes2 = Math.floor(2 * hpCurrent);
    const hpRatio = Math.floor(hpMaxTimes3 - hpCurrentTimes2);
    const CR = captureRate * ballSettings.ballMod;
    const top = hpRatio * CR;
    const bottom = hpMaxTimes3;
    const fraction = top / bottom;
    console.log(`GenIII (ballsettings = ${ballSettings.ballMod}) 
                 top = ${top}, bottom = ${bottom}, result = ${fraction}`);
    // TODO: Use status changes
    return fraction * bonusStatus;
}

export function calculateGenIIICaptureProbability(captureRate,
    ballSettings,
    pokemonHpStat,
    pokemonLevel,
    hp,
    statusAilment,
    valueCallbacks) {
    const a = calculateModifiedCatchRateGenIII(captureRate,
        ballSettings,
        pokemonHpStat,
        pokemonLevel,
        hp,
        statusAilment,
        valueCallbacks);
    valueCallbacks?.setA(a);
    return a / 255.0;
}
