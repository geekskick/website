const calculateGenIF = (ballFMod, pokemonHpStat, pokemonLevel, hp, valueCallbacks) => {
    // TODO: Assume hp levels
    console.log(`calculateGenIF(${ballFMod}, ${pokemonHpStat}, ${pokemonLevel}, ${hp})`);
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks?.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    valueCallbacks?.setHpCurrent(hpCurrent);
    valueCallbacks?.setBallFMod(ballFMod);
    return (hpMax * 255 * 4) / (hpCurrent * ballFMod);
}

function calculateHpMax(pokemonHpStat, pokemonLevel) {
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

export function calculateGenICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
    // TODO: Get user status ailment
    console.log("calculateGenICaptureProbability::ballSettings = ", ballSettings);
    console.log("calculateGenICaptureProbability::captureRate = ", captureRate);
    console.log("calculateGenICaptureProbability::pokemonHpStat = ", pokemonHpStat);
    console.log("calculateGenICaptureProbability::pokemonLevel = ", pokemonLevel);
    console.log("calculateGenICaptureProbability::hp = ", hp);
    console.log("calculateGenICaptureProbability::statusAilment = ", statusAilment);
    console.log("calculateGenICaptureProbability::valueCallbacks = ", valueCallbacks);
    const _statusAilment = 0;
    valueCallbacks?.setAilment(_statusAilment);
    const ballMod = ballSettings.ballMod;
    valueCallbacks?.setBallMod(ballMod);
    const p0 = _statusAilment / (ballMod + 1);
    valueCallbacks?.setP0(p0);

    const f = calculateGenIF(ballSettings.fBallMod, pokemonHpStat, pokemonLevel, hp, valueCallbacks);
    valueCallbacks?.setF(f);
    console.log(`GenIF() = ${f}`);
    console.log(`(${captureRate} + 1) / (${ballMod} + 1)) * ((${f}+ 1) / 256)`)
    const p1 = ((captureRate + 1) / (ballMod + 1)) * ((f + 1) / 256);
    valueCallbacks?.setP1(p1);
    console.log(`p0 = ${p0}, p1 = ${p1}`);
    return p0 + p1;
}

function calculateRateModified(pokemonCaptureRate, ballModifier) {
    let rateModified = pokemonCaptureRate * ballModifier; // capture_rate of the pokemon * ball used
    console.log(`The capture rate * the ball modifier is (${pokemonCaptureRate} * ${ballModifier} = ${rateModified})`);
    rateModified = Math.min(255, rateModified);
    return Math.max(1, rateModified);
}

function calculateModifiedCatchRate(pokemonCaptureRate, ballModifier, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    console.log(`capture rate = ${pokemonCaptureRate}, ballModifier = ${ballModifier}`);
    const minimum = 1.0;
    const maximum = 255;
    // TODO: Use actual values here
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks?.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    valueCallbacks?.setHpCurrent(hpCurrent);
    valueCallbacks?.setBallModifier(ballModifier);

    let hpMaxTimes3 = hpMax * 3;
    let hpCurrentTimes2 = hpCurrent * 2;
    console.log("hpCurrent * 2 = ", hpCurrentTimes2);
    console.log("hpMax * 3 = ", hpMaxTimes3);
    if (hpMaxTimes3 > maximum) {
        console.log("hpMax*3 is greater than ", maximum, " so we divide both twice");
        hpMaxTimes3 = Math.floor(hpMaxTimes3 / 2);
        hpMaxTimes3 = Math.floor(hpMaxTimes3 / 2);
        hpCurrentTimes2 = Math.floor(hpCurrentTimes2 / 2);
        hpCurrentTimes2 = Math.floor(hpCurrentTimes2 / 2);
        hpMaxTimes3 = Math.max(hpMaxTimes3, 1);
        hpCurrentTimes2 = Math.max(hpCurrentTimes2, 1);
        valueCallbacks.setHalfHalf();
    }
    console.log("hpCurrent * 2 = ", hpCurrentTimes2);
    console.log("hpMax * 3 = ", hpMaxTimes3);


    // TODO: use the status
    const bonusStatus = 0; // 10 for sleep or freeze, else 0;
    valueCallbacks.setAilment(bonusStatus);
    const rateModified = calculateRateModified(pokemonCaptureRate, ballModifier);
    valueCallbacks.setRateModified(rateModified);

    const candidate = ((hpMaxTimes3 - hpCurrentTimes2) * rateModified) / (3 * hpMax);
    console.log("Candidate result = ", candidate);
    const result = Math.max(candidate, minimum) + bonusStatus;
    return Math.min(result, maximum);
}



export function calculateGenIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    const a = calculateModifiedCatchRate(captureRate, ballSettings.ballMod, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks);
    valueCallbacks.setA(a);
    const randomMax = 255;
    // if random <= a it's caught. 
    // therefore the probability is a/randomMax
    console.assert(a >= 1, "Calculated a is < 1");
    console.assert(a <= 255, "Calculated a is > 255");
    return a / randomMax;
}

function calculateModifiedCatchRateGenIII(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    valueCallbacks.setBallModifier(ballSettings.ballMod);
    valueCallbacks.setHpCurrent(hpCurrent);
    const bonusStatus = 1;
    valueCallbacks.setAilment(bonusStatus);
    const hpMaxTimes3 = 3 * hpMax;
    const hpCurrentTimes2 = 2 * hpCurrent;
    const top = (hpMaxTimes3 - hpCurrentTimes2) * captureRate * ballSettings.ballMod;
    const bottom = hpMaxTimes3;
    const fraction = top / bottom;
    // TODO: take into account status changes
    return fraction * bonusStatus;
}

export function calculateGenIIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    const a = calculateModifiedCatchRateGenIII(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks);
    valueCallbacks.setA(a);
    return a / 255;
}

function calculateModifiedCatchRateGenV(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, status, valueCallbacks) {
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    valueCallbacks.setHpCurrent(hpCurrent);
    valueCallbacks.setBallModifier(ballSettings.ballMod);

    const darkGrass = 0.5;

    valueCallbacks.setDarkGrass(darkGrass);
    valueCallbacks.setAilment(1);
    const hpMaxTimes3 = 3 * hpMax;
    const hpCurrentTimes2 = 2 * hpCurrent;
    let top;
    try {
        top = (hpMaxTimes3 - hpCurrentTimes2) * 4096 * darkGrass * captureRate * ballSettings.ballMod;
    }
    catch (err) {
        throw 'No ball modifier available'
    }

    const bottom = hpMaxTimes3;
    const fraction = top / bottom;
    // TODO: take into account status changes
    return fraction * 1;
}

export function calculateGenVCaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    const a = calculateModifiedCatchRateGenV(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks);
    valueCallbacks.setA(a);
    if (a >= 1044480) {
        return 1;
    }
    // TODO: what is this value?
    return a / (255 * 4096);
}

