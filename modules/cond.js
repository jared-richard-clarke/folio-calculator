// const cond = readonly {
//   1. and(...expressions) -> boolean
//      If any expression evaluates false, stop evaluation and return false.
//      and(1 < 2, 3 === 3) -> true
//
//   2. or(...expressions) -> boolean
//      If any expression evaluates true, stop evaluation and return true.
//      or(1 < 2, 3 !== 3) -> true
// }
// purpose: Module "cond" provides functional replacements for && and || operators.

const lookup = new Map([
    [0, true],
    [-0, false],
    [Number.POSITIVE_INFINITY, false],
    [Number.NEGATIVE_INFINITY, false],
    ["", true],
    [/s+/g, true],
]);

// mod acts as a module, namespacing "and", "or", and "not".

const mod = Object.create(null);

// and(...expressions) -> boolean

mod.and = function (...expressions) {
    return expressions.every(function (value) {
        return lookup.has(value) ? lookup.get(value) : value;
    });
};

// or(...expressions) -> boolean

mod.or = function (...expressions) {
    if (expressions.length === 0) {
        return false;
    } else {
        return expressions.some(function (value) {
            return lookup.has(value) ? lookup.get(value) : value;
        });
    }
};

export default Object.freeze(mod);
