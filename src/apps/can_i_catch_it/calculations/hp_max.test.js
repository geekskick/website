const calculations = require('./hp_max.js');


describe('hp max', () => {
    test('bulbasaur', () => {
        const actual = calculations.calculateHpMax(45, 100);
        const expected = 200;
        expect(actual).toBeCloseTo(expected);
    });
});
