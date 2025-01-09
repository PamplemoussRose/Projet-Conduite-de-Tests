const assert = require('assert');

describe('Addition', () => {
function add(a, b) {
    return a + b;
}

it('adds 1 + 2 to equal 3', () => {
    assert.strictEqual(add(1, 2), 3);
});
});