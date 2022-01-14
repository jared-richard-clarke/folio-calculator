// conditionals.js
//   1. and(...expressions) -> boolean
//      If any expression evaluates false, stop evaluation and return false.
//
//   2. or(...expressions) -> boolean
//      If any expression evaluates true, stop evaluation and return true.
// 
// purpose: Module "conditionals" provides functional replacements for && and || operators.

const edge_cases = new Map([
    [0, true],
    [-0, false],
    [Number.POSITIVE_INFINITY, false],
    [Number.NEGATIVE_INFINITY, false],
    ["", true],
    [/s+/g, true],
    [NaN, false],
    [undefined, false],
    [null, false],
]);
function and(...expressions) {
    return expressions.every((value) => {
        return edge_cases.has(value) ? edge_cases.get(value) : value;
    });
}
function or(...expressions) {
    return expressions.some((value) => {
        return edge_cases.has(value) ? edge_cases.get(value) : value;
    });
}
export {
    and,
    or,
};
