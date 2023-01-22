const { experimental_extendTheme } = require("@mui/material");
const calculations = require("./calculations");
const balls = require('./data/balls.json');

function testBulbasaurAgainstThisBall(ballSettings, expected, hp = 1) {
    // bulbasaur
    const captureRate = 45;
    const pokemonHpStat = 45;
    const pokemonLevel = 100;
    const statusAilment = 'none';
    const actual = calculations.calculateGenIIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
    expect(actual).toBeCloseTo(expected);
}

describe('gen iii', () => {
    /*
    describe('with changed catch rate', () => {
        test('mewtwo', () => {
            const captureRate = 3;
            const pokemonHpStat = 106;
            const pokemonLevel = 100;
            const statusAilment = 'none';
            const hp = 1;
            const expected = 0.00781;
            const ballSettings = balls['poke-ball']['settings']['generation-ii'];
            const actual = calculations.calculateGenIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
            expect(actual).toBeCloseTo(expected);
        });

        test('mewtwo with different level', () => {
            const captureRate = 3;
            const pokemonHpStat = 106;
            const pokemonLevel = 10;
            const statusAilment = 'none';
            const hp = 1;
            const expected = 0.00781;
            const ballSettings = balls['poke-ball']['settings']['generation-ii'];
            const actual = calculations.calculateGenIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
            expect(actual).toBeCloseTo(expected);
        })
    })
    describe('with hp changed', () => {
        test('to half', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-ii'], 0.12109, 0.5);
        });
        test('to 20%', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-ii'], 0.15503, 0.2);
        });
    });
    */
    describe('with no hp or status changes', () => {
        test('pokeball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-iii'], 0.06249);
        });

        test('great ball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['great-ball']['settings']['generation-iii'], 0.09265);
        });

        test('ultra ball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['ultra-ball']['settings']['generation-iii'], 0.1233);
        });


        test('callbacks are called with correct values', () => {
            // bulbasaur
            const captureRate = 45;

            // pokeball
            const ballSettings = {
                "ballMod": 1,
            };

            const pokemonHpStat = 45;
            const pokemonLevel = 100;
            const hp = 1;
            const statusAilment = 'none';

            const callbacks = {
                setAilment(value) {
                    this.ailment = value;
                },
                setBallMod(value) {
                    this.ballMod = value;
                },
                setBallModifier(value) {
                    this.ballModifier = value;
                },
                setHpMax(value) {
                    this.hpMax = value;
                },
                setHpCurrent(value) {
                    this.hpCurrent = value;
                },
                setF(value) {
                    this.f = value;
                },
                setRateModified(value) {
                    this.rateModified = value;
                },
                setA(value) {
                    this.a = value;
                }
            };
            const actual = calculations.calculateGenIIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, callbacks);
            expect(callbacks.ailment).toBe(1);
            expect(callbacks.hpMax).toBeCloseTo(200); // according to pycosites
            expect(callbacks.hpCurrent).toBeCloseTo(200);
            expect(callbacks.ballModifier).toBe(1);
            expect(callbacks.a).toBe(15);
        });
    });
});