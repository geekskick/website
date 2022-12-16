const calculateGenIF = () => {
    const hp_max = 100;
    const hp_current = 50;
    // assume pokeball
    const ball = 12;
    return (hp_max * 255 * 4) / (hp_current * ball);
}

function calculateGenICaptureRate(capture_rate) {
    // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
    // TODO: Get user status ailment
    const status_ailent = 0;

    // TODO: Get user pokeball used
    const ball_mod = 255;
    const p0 = status_ailent / (ball_mod + 1);

    // TODO: Calculate this
    const f = calculateGenIF();
    console.log(`GenIF() = ${f}`);
    console.log(`(${capture_rate} + 1) / (${ball_mod} + 1)) * ((${f}+ 1) / 256)`)
    const p1 = ((capture_rate + 1) / (ball_mod + 1)) * ((f + 1) / 256);
    console.log(`p0 = ${p0}, p1 = ${p1}`);
    return p0 + p1;
}

export default function calculateCaptureRate(generation_name, capture_rate) {

    const rate_calculators = {
        "generation-i": calculateGenICaptureRate
    }
    console.log(`Selected generation = ${generation_name}`);
    const rc = rate_calculators[generation_name](capture_rate);
    console.log(`Rate calculated as ${rc}`);
    return rc;

}
