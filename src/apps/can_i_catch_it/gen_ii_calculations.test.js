const { experimental_extendTheme } = require("@mui/material");
const calculations = require("./calculations");
const balls = require('./data/balls.json');

function testBulbasaurAgainstThisBall(ballSettings, expected, hp = 1) {
    // bulbasaur
    const captureRate = 45;
    const pokemonHpStat = 45;
    const pokemonLevel = 100;
    const statusAilment = 'none';
    const actual = calculations.calculateGenIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, null);
    expect(actual).toBeCloseTo(expected);
}

describe('gen ii', () => {

    describe('with no hp or status changes', () => {
        test('pokeball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['poke-ball']['settings']['generation-ii'], 0.06055);
        });

        test('great ball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['great-ball']['settings']['generation-ii'], 0.08984);
        });

        test('ultra ball matches dragonflycave intended value', () => {
            testBulbasaurAgainstThisBall(balls['ultra-ball']['settings']['generation-ii'], 0.11914);
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
            // according to dragonfly cave
            const expected = 0.06036;

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
                setHalfHalf(value) {
                    this.halfHalf = value;
                },
                setRateModified(value) {
                    this.rateModified = value;
                },
                setA(value) {
                    this.a = value;
                }
            };
            const actual = calculations.calculateGenIICaptureProbability(captureRate, ballSettings, pokemonHpStat, pokemonLevel, hp, statusAilment, callbacks);
            expect(callbacks.ailment).toBe(0);
            expect(callbacks.hpMax).toBeCloseTo(200); // according to pycosites
            expect(callbacks.hpCurrent).toBeCloseTo(200);
            expect(callbacks.ballModifier).toBe(1);
            expect(callbacks.halfHalf).toBe(undefined);
            expect(callbacks.rateModified).toBe(45);
            expect(callbacks.a).toBe(15);
        });
    });
});