const calculateGenIF = (ballFMod, pokemonHpStat, pokemonLevel, hp, valueCallbacks) => {
    console.log(`calculateGenIF(${ballFMod}, ${pokemonHpStat}, ${pokemonLevel}, ${hp})`);
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks?.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    console.log(`HPCurrent = ${hpMax} * ${hp} = ${hpCurrent}`)
    valueCallbacks?.setHpCurrent(hpCurrent);
    valueCallbacks?.setBallFMod(ballFMod);
    const candidateF = (hpMax * 255 * 4) / (hpCurrent * ballFMod);
    return Math.min(255, candidateF);
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
    const p1 = ((captureRate + 1) / (ballMod + 1)) * ((f + 1) / 256);
    console.log(`p1 = (${captureRate} + 1) / (${ballMod} + 1)) * ((${f}+ 1) / 256) = ${p1}`)
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
        hpMaxTimes3 = Math.floor(hpMaxTimes3 / 4);
        hpCurrentTimes2 = Math.floor(hpCurrentTimes2 / 4);
        // Ensure that we have at least 1 here
        hpMaxTimes3 = Math.max(hpMaxTimes3, 1);
        hpCurrentTimes2 = Math.max(hpCurrentTimes2, 1);
        valueCallbacks?.setHalfHalf();
    }
    console.log("hpCurrent * 2 = ", hpCurrentTimes2);
    console.log("hpMax * 3 = ", hpMaxTimes3);


    // TODO: use the status
    const bonusStatus = 0; // 10 for sleep or freeze, else 0;
    valueCallbacks?.setAilment(bonusStatus);
    const rateModified = calculateRateModified(pokemonCaptureRate, ballModifier);
    valueCallbacks?.setRateModified(rateModified);

    const candidate = ((hpMaxTimes3 - hpCurrentTimes2) * rateModified) / (hpMaxTimes3);
    console.log("Candidate result = ", candidate);
    const result = Math.max(candidate, minimum) + bonusStatus;
    return Math.min(result, maximum);
}



export function calculateGenIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    const a = calculateModifiedCatchRate(captureRate, ballSettings.ballMod, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks);
    valueCallbacks?.setA(a);
    const randomMax = 255;
    // if random <= a it's caught. 
    // therefore the probability is a/randomMax
    console.assert(a >= 1, "Calculated a is < 1");
    console.assert(a <= 255, "Calculated a is > 255");
    return a / randomMax;
}

function calculateModifiedCatchRateGenIII(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
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
    const CR = Math.floor(captureRate * ballSettings.ballMod);
    const top = Math.floor(hpRatio * CR);
    const bottom = hpMaxTimes3;
    const fraction = Math.floor(top / bottom);
    console.log(`GenIII (ballsettings = ${ballSettings.ballMod}) top = ${top}, bottom = ${bottom}, result = ${fraction}`)
    // TODO: take into account status changes
    // greatball: final probability = 0.09265
    //                                0.09265 * 255 = 23.6(ish) as this result. 
    //                                23.6 * 600 = 14160 at top of fraction
    //                                14160 / 200 = 70.8 as result of (C * B) where C = 45 therefore ballmod = 1.57?!
    return Math.floor(fraction * bonusStatus);
}

export function calculateGenIIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks) {
    const a = Math.floor(calculateModifiedCatchRateGenIII(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, valueCallbacks));
    valueCallbacks?.setA(a);
    return a / 255.0;
}

function calculateModifiedCatchRateGenV(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, status, valueCallbacks) {
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
    }
    catch (err) {
        throw new Error('No ball modifier available');
    }

    const bottom = hpMaxTimes3;
    const fraction = top / bottom;
    // TODO: take into account status changes
    return fraction * passPower;
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

