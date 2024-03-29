/* eslint-disable max-len */
const calculations = require('./gen_i.js');
const balls = require('../data/balls.json');

function testBulbasaurAgainstThisBall(ballSettings, expected, hp = 1) {
    // bulbasaur
    const captureRate = 45;
    const pokemonHpStat = 45;
    const pokemonLevel = 100;
    const statusAilment = 'none';
    const actual = calculations.calculateGenICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
    expect(actual).toBeCloseTo(expected);
}

describe('gen i', () => {
    describe('with changed catch rate', () => {
        test('mewtwo', () => {
            const captureRate = 3;
            const pokemonHpStat = 106;
            const pokemonLevel = 100;
            const statusAilment = 'none';
            const hp = 1;
            const expected = 0.00525;
            const ballSettings = balls['poke-ball']['settings']['generation-i'];
            const actual = calculations.calculateGenICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
            expect(actual).toBeCloseTo(expected);
        });

        test('mewtwo with different level', () => {
            const captureRate = 3;
            const pokemonHpStat = 106;
            const pokemonLevel = 10;
            const statusAilment = 'none';
            const hp = 1;
            const expected = 0.00547;
            const ballSettings = balls['poke-ball']['settings']['generation-i'];
            const actual = calculations.calculateGenICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
            expect(actual).toBeCloseTo(expected);
        });
    });
    describe('with hp changed', () => {
        test('to half', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-i'], 0.12147, 0.5);
        });
        test('to 20%', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-i'], 0.17969, 0.2);
        });
    });

    describe('with no hp or status changes', () => {
        test('pokeball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-i'], 0.06036);
        });

        test('great ball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['great-ball']['settings']['generation-i'], 0.1198);
        });

        test('ultra ball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['ultra-ball']['settings']['generation-i'], 0.10233);
        });


        test('callbacks are called with correct values', () => {
            // bulbasaur
            const captureRate = 45;

            // pokeball
            const ballSettings = {
                'ballMod': 255,
                'fBallMod': 12,
            };

            const pokemonHpStat = 45;
            const pokemonLevel = 100;
            const hp = 1;
            const statusAilment = 'none';
            // according to dragonfly cave
            const expected = 0.06036;

            const callbacks = {
                setAilment(value) {
                    this.ailment = value;
                },
                setBallMod(value) {
                    this.ballMod = value;
                },
                setP0(value) {
                    this.P0 = value;
                },
                setP1(value) {
                    this.P1 = value;
                },
                setHpMax(value) {
                    this.hpMax = value;
                },
                setHpCurrent(value) {
                    this.hpCurrent = value;
                },
                setBallFMod(value) {
                    this.ballFMod = value;
                },
                setF(value) {
                    this.f = value;
                },
            };
            const actual = calculations.calculateGenICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, callbacks);
            expect(callbacks.ailment).toBe(0);
            expect(callbacks.hpMax).toBeCloseTo(200); // according to pycosites
            expect(callbacks.hpCurrent).toBeCloseTo(200);
            expect(callbacks.ballMod).toBe(255);
            expect(callbacks.ballFMod).toBe(12);
            expect(callbacks.f).toBe(85);
            expect(callbacks.P0).toBeCloseTo(0); // since the status ailment is none, this can only be 0
            expect(callbacks.P1).toBeCloseTo(0.06036);
            expect(actual).toBeCloseTo(expected);
        });
    });
});
