const calculateGenIF = (ballName, pokemonHpStat, pokemonLevel, hp) => {
    // TODO: Assume hp levels
    console.log(`calculateGenIF(${ballName}, ${pokemonHpStat}, ${pokemonLevel})`);
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    const hpCurrent = hpMax * hp;
    console.log(`hpMax = ${hpMax}`);
    console.log(`hpCurrent = ${hpCurrent}`);

    let ball = 12;
    if (ballName === "great-ball") {
        ball = 8;
    }
    return (hpMax * 255 * 4) / (hpCurrent * ball);
}

function getGenIBallMod(ballName) {
    //ballMod = 255 if using a Poké Ball, 200 if using a Great Ball, and 150 otherwise.
    if (ballName === "great-ball") {
        return 200;
    }
    else if (ballName === "poke-ball") {
        return 255;
    }
    else {
        return 150;
    }
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
function getGenIIBallMod(ballName) {
    console.log("The ball is", ballName);
    if (ballName === "poke-ball" || ballName === 'park-ball') {
        return 1;
    }
    else if (ballName === 'great-ball' || ballName === 'sport-ball' || ballName === 'safari-ball') {
        return 1.5;
    }
    else if (ballName === 'ultra-ball') {
        return 2;
    }
    else if (ballName === 'master-ball') {
        return 255;
    }
    throw `${ballName} is an unsupported ball type`;
}

function calculateGenICaptureProbability(captureRate, ballName, pokemonHpStat, pokemonLevel, hp) {
    // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
    // TODO: Get user status ailment
    const statusAilent = 0;

    const ballMod = getGenIBallMod(ballName);
    const p0 = statusAilent / (ballMod + 1);

    // TODO: Calculate this
    const f = calculateGenIF(ballName, pokemonHpStat, pokemonLevel, hp);
    console.log(`GenIF() = ${f}`);
    console.log(`(${captureRate} + 1) / (${ballMod} + 1)) * ((${f}+ 1) / 256)`)
    const p1 = ((captureRate + 1) / (ballMod + 1)) * ((f + 1) / 256);
    console.log(`p0 = ${p0}, p1 = ${p1}`);
    return p0 + p1;
}

function calculateRateModified(pokemonCaptureRate, ballModifier) {
    let rateModified = pokemonCaptureRate * ballModifier; // capture_rate of the pokemon * ball used
    console.log(`The capture rate * the ball modifier is (${pokemonCaptureRate} * ${ballModifier} = ${rateModified})`);
    rateModified = Math.min(255, rateModified);
    return Math.max(1, rateModified);
}

function calculateModifiedCatchRate(pokemonCaptureRate, ballModifier, pokemonHpStat, pokemonLevel, hp) {
    console.log(`capture rate = ${pokemonCaptureRate}, ballModifier = ${ballModifier}`)
    const minimum = 1.0;
    const maximum = 255;
    // TODO: Use actual values here
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    const hpCurrent = hpMax * hp;

    console.log(`hpMax = ${hpMax}`);
    console.log(`hpCurrent = ${hpCurrent}`);

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
    }
    console.log("hpCurrent * 2 = ", hpCurrentTimes2);
    console.log("hpMax * 3 = ", hpMaxTimes3);


    // TODO: use the status
    const bonusStatus = 0; // 10 for sleep or freeze, else 0;
    const rateModified = calculateRateModified(pokemonCaptureRate, ballModifier);

    console.log("rateModified = ", rateModified);
    console.log("bonusStatus  = ", bonusStatus);
    const candidate = ((hpMaxTimes3 - hpCurrentTimes2) * rateModified) / (3 * hpMax);
    console.log("Candidate result = ", candidate);
    const result = Math.max(candidate, minimum) + bonusStatus;
    return Math.min(result, maximum);
}



function calculateGenIICaptureProbability(captureRate, ballName, pokemonHpStat, pokemonLevel, hp) {
    // TODO: Use a real ball modifer these are just pokeballs rn
    const a = calculateModifiedCatchRate(captureRate, getGenIIBallMod(ballName), pokemonHpStat, pokemonLevel, hp);
    const randomMax = 255;
    // if random <= a it's caught. 
    // therefore the probability is a/randomMax
    console.assert(a >= 1, "Calculated a is < 1");
    console.assert(a <= 255, "Calculated a is > 255");
    return a / randomMax;
}

export default function calculateCaptureProbability(generationName, captureRate, ballName, pokemonHpStat, pokemonLevel, hp) {
    console.log("calculateCaptureProbability", generationName, captureRate, ballName, pokemonHpStat, pokemonLevel, hp);
    if (ballName === "master-ball") {
        return 1;
    }
    const rateCalculators = {
        "generation-i": calculateGenICaptureProbability,
        "generation-ii": calculateGenIICaptureProbability
    }
    console.log(`Selected generation = ${generationName}`);
    const rc = rateCalculators[generationName](captureRate, ballName, pokemonHpStat, pokemonLevel, hp);
    console.log(`Rate calculated as ${rc}`);
    return rc;

}
