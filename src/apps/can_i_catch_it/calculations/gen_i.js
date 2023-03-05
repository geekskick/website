
import { calculateHpMax } from './hp_max';

export function calculateGenIF(ballFMod, pokemonHpStat, pokemonLevel, hp, valueCallbacks) {
    console.log(`calculateGenIF(${ballFMod}, ${pokemonHpStat}, ${pokemonLevel}, ${hp})`);
    const hpMax = calculateHpMax(pokemonHpStat, pokemonLevel);
    valueCallbacks?.setHpMax(hpMax);
    const hpCurrent = hpMax * hp;
    console.log(`HPCurrent = ${hpMax} * ${hp} = ${hpCurrent}`);
    valueCallbacks?.setHpCurrent(hpCurrent);
    valueCallbacks?.setBallFMod(ballFMod);
    const candidateF = (hpMax * 255 * 4) / (hpCurrent * ballFMod);
    return Math.min(255, candidateF);
}

export function calculateGenICaptureProbability(captureRate,
    ballSettings,
    pokemonHpStat,
    pokemonLevel,
    hp,
    statusAilment,
    valueCallbacks) {
    // https://bulbapedia.bulbagarden.net/wiki/Catch_rate
    // TODO: Get user status ailment
    console.log('calculateGenICaptureProbability::ballSettings = ', ballSettings);
    console.log('calculateGenICaptureProbability::captureRate = ', captureRate);
    console.log('calculateGenICaptureProbability::pokemonHpStat = ', pokemonHpStat);
    console.log('calculateGenICaptureProbability::pokemonLevel = ', pokemonLevel);
    console.log('calculateGenICaptureProbability::hp = ', hp);
    console.log('calculateGenICaptureProbability::statusAilment = ', statusAilment);
    console.log('calculateGenICaptureProbability::valueCallbacks = ', valueCallbacks);
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
    console.log(`p1 = (${captureRate} + 1) / (${ballMod} + 1)) * ((${f}+ 1) / 256) = ${p1}`);
    valueCallbacks?.setP1(p1);
    console.log(`p0 = ${p0}, p1 = ${p1}`);
    return p0 + p1;
}
