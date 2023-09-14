import constants from "./constants.js";

function identity(x) {
    return x;
}
function neg(x) {
    return 0 - x;
}
function add(x, y) {
    return x + y;
}
function sub(x, y) {
    return x - y;
}
function mul(x, y) {
    if (x === 0 || y === 0) {
        return 0;
    }
    return x * y;
}

function div(x, y) {
    if (y === 0) {
        return constants.DIVIDE_ZERO;
    }
    return x / y;
}

function pow(x, y) {
    if (x < 0 && !Number.isInteger(y)) {
        return constants.COMPLEX;
    }
    return Math.pow(x, y);
}

const unary_operation = Object.freeze({
    [constants.ADD]: identity,
    [constants.SUBTRACT]: neg,
    [constants.SUBTRACT_ALT]: neg,
});

const binary_operation = Object.freeze({
    [constants.ADD]: add,
    [constants.SUBTRACT]: sub,
    [constants.SUBTRACT_ALT]: sub,
    [constants.IMPLIED_MULTIPLY]: mul,
    [constants.MULTIPLY]: mul,
    [constants.MULTIPLY_ALT]: mul,
    [constants.DIVIDE]: div,
    [constants.DIVIDE_ALT]: div,
    [constants.EXPONENT]: pow,
});

const key_map = Object.freeze({
    " ": constants.SPACE,
    "Space": constants.SPACE,
    "Backspace": constants.DELETE,
    "Clear": constants.CLEAR,
    "Enter": constants.EQUAL,
    "=": constants.EQUAL,
    "(": constants.OPEN_PAREN,
    ")": constants.CLOSE_PAREN,
    "+": constants.ADD,
    "-": constants.SUBTRACT,
    "×": constants.MULTIPLY,
    "*": constants.MULTIPLY,
    "÷": constants.DIVIDE,
    "/": constants.DIVIDE,
    "^": constants.EXPONENT,
    ".": constants.DECIMAL_POINT,
    "0": constants.ZERO,
    "1": constants.ONE,
    "2": constants.TWO,
    "3": constants.THREE,
    "4": constants.FOUR,
    "5": constants.FIVE,
    "6": constants.SIX,
    "7": constants.SEVEN,
    "8": constants.EIGHT,
    "9": constants.NINE,
});

const is_space = (function () {
    const set = new Set([
        constants.WHITE_SPACE,
        constants.TAB,
        constants.LINEFEED,
        constants.CARRIAGE_RETURN,
        constants.VERTICAL_TAB,
        constants.FORM_FEED,
    ]);
    return function (x) {
        return set.has(x);
    };
})();

const is_paren = (function () {
    const set = new Set([constants.OPEN_PAREN, constants.CLOSE_PAREN]);
    return function (x) {
        return set.has(x);
    };
})();

function is_exponent_suffix(x) {
    return x === constants.UPPER_E || x === constants.LOWER_E;
}

const is_minus = (function () {
    const set = new Set([
        constants.SUBTRACT,
        constants.SUBTRACT_ALT,
    ]);
    return function (x) {
        return set.has(x);
    };
})();

const is_plus_minus = (function () {
    const set = new Set([
        constants.ADD,
        constants.SUBTRACT,
        constants.SUBTRACT_ALT,
    ]);
    return function (x) {
        return set.has(x);
    };
})();

const is_digit = (function () {
    const set = new Set([
        constants.ZERO,
        constants.ONE,
        constants.TWO,
        constants.THREE,
        constants.FOUR,
        constants.FIVE,
        constants.SIX,
        constants.SEVEN,
        constants.EIGHT,
        constants.NINE,
    ]);
    return function (x) {
        return set.has(x);
    };
})();

const is_operator = (function () {
    const set = new Set([
        constants.ADD,
        constants.SUBTRACT,
        constants.SUBTRACT_ALT,
        constants.MULTIPLY,
        constants.MULTIPLY_ALT,
        constants.DIVIDE,
        constants.DIVIDE_ALT,
        constants.EXPONENT,
    ]);
    return function (x) {
        return set.has(x);
    };
})();

const is_ascii_letter = (function () {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = lower.toUpperCase();
    const set = new Set([...lower].concat([...upper]));
    return function (x) {
        return set.has(x);
    };
})();

export default Object.freeze({
    unary_operation,
    binary_operation,
    key_map,
    is_space,
    is_paren,
    is_exponent_suffix,
    is_minus,
    is_plus_minus,
    is_digit,
    is_operator,
    is_ascii_letter,
});
