
import { randInt } from './random';


test('rand interger', () => {
    const result = randInt(1, 2);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(2);
})
