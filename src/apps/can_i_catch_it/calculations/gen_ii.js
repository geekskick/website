import { calculateHpMax } from './hp_max';


function calculateRateModified(pokemonCaptureRate, ballModifier) {
    let rateModified = pokemonCaptureRate * ballModifier; // capture_rate of the pokemon * ball used
    console.log(`The capture rate * the ball modifier is (${pokemonCaptureRate} * ${ballModifier} = ${rateModified})`);
    rateModified = Math.min(255, rateModified);
    return Math.max(1, rateModified);
}

function calculateModifiedCatchRate(pokemonCaptureRate,
    ballModifier,
    pokemonHpStat,
    pokemonLevel,
    hp,
    statusAilment,
    valueCallbacks) {
    console.log(`capture rate = ${pokemonCaptureRate}, ballModifier = ${ballModifier}`);
    const minimum = 1.0;
    const maximum = 255;
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks?.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    valueCallbacks?.setHpCurrent(hpCurrent);
    valueCallbacks?.setBallModifier(ballModifier);

    let hpMaxTimes3 = hpMax * 3;
    let hpCurrentTimes2 = hpCurrent * 2;
    console.log('hpCurrent * 2 = ', hpCurrentTimes2);
    console.log('hpMax * 3 = ', hpMaxTimes3);
    if (hpMaxTimes3 > maximum) {
        console.log('hpMax*3 is greater than ', maximum, ' so we divide both twice');
        hpMaxTimes3 = Math.floor(hpMaxTimes3 / 4);
        hpCurrentTimes2 = Math.floor(hpCurrentTimes2 / 4);
        // Ensure that we have at least 1 here
        hpMaxTimes3 = Math.max(hpMaxTimes3, 1);
        hpCurrentTimes2 = Math.max(hpCurrentTimes2, 1);
        valueCallbacks?.setHalfHalf();
    }
    console.log('hpCurrent * 2 = ', hpCurrentTimes2);
    console.log('hpMax * 3 = ', hpMaxTimes3);


    // TODO: use the status
    const bonusStatus = 0; // 10 for sleep or freeze, else 0;
    valueCallbacks?.setAilment(bonusStatus);
    const rateModified = calculateRateModified(pokemonCaptureRate, ballModifier);
    valueCallbacks?.setRateModified(rateModified);

    const candidate = ((hpMaxTimes3 - hpCurrentTimes2) * rateModified) / (hpMaxTimes3);
    console.log('Candidate result = ', candidate);
    const result = Math.max(candidate, minimum) + bonusStatus;
    return Math.min(result, maximum);
}


export function calculateGenIICaptureProbability(captureRate,
    ballSettings,
    pokemonHpStat,
    pokemonLevel,
    hp,
    statusAilment,
    valueCallbacks) {
    const a = calculateModifiedCatchRate(captureRate,
        ballSettings.ballMod,
        pokemonHpStat,
        pokemonLevel,
        hp,
        statusAilment,
        valueCallbacks);
    valueCallbacks?.setA(a);
    const randomMax = 255;
    // if random <= a it's caught.
    // therefore the probability is a/randomMax
    console.assert(a >= 1, 'Calculated a is < 1');
    console.assert(a <= 255, 'Calculated a is > 255');
    return a / randomMax;
}
