const calculateGenIF = (ballName) => {
    // TODO: Assume hp levels
    const hpMax = 100;
    const hpCurrent = 100;

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

function calculateGenICaptureProbability(captureRate, ballName) {
    // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
    // TODO: Get user status ailment
    if (ballName === "master-ball") {
        return 1;
    }

    const statusAilent = 0;

    const ballMod = getGenIBallMod(ballName);
    const p0 = statusAilent / (ballMod + 1);

    // TODO: Calculate this
    const f = calculateGenIF(ballName);
    console.log(`GenIF() = ${f}`);
    console.log(`(${captureRate} + 1) / (${ballMod} + 1)) * ((${f}+ 1) / 256)`)
    const p1 = ((captureRate + 1) / (ballMod + 1)) * ((f + 1) / 256);
    console.log(`p0 = ${p0}, p1 = ${p1}`);
    return p0 + p1;
}

export default function calculateCaptureProbability(generationName, captureRate, ballName) {
    const rateCalculators = {
        "generation-i": calculateGenICaptureProbability
    }
    console.log(`Selected generation = ${generationName}`);
    const rc = rateCalculators[generationName](captureRate, ballName);
    console.log(`Rate calculated as ${rc}`);
    return rc;

}
