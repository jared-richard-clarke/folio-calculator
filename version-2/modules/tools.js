import constants from "./constants.js";

// > identity(x) -> x
//   The identity operator. Returns its given input unchanged.
function identity(x) {
    return x;
}
// > neg(number) -> number
//   If given number is positive, returns negative.
//   If given number is negative, returns positive.
//   Unlike JavaScript's unary-negation operator, this
//   function does NOT return negative zero.
function neg(x) {
    return 0 - x;
}
// > add(number, number) -> number
//   Returns the sum of two numbers. Otherwise
//   returns a string describing an error condition.
function add(x, y) {
    return x + y;
}
// > sub(number, number) -> number
//   Returns the difference of two numbers. Otherwise
//   returns a string describing an error condition.
function sub(x, y) {
    return x - y;
}
// > mul(number, number) -> number
//   Returns the product of two numbers.
function mul(x, y) {
    if (x === 0 || y === 0) {
        return 0;
    }
    return x * y;
}
// > div(number, number) -> number | string
//   Returns the quotient of two numbers. Otherwise
//   returns a string describing an error condition.
function div(x, y) {
    if (y === 0) {
        return constants.DIVIDE_ZERO;
    }
    return x / y;
}
// > pow(number, number) -> number | string
//   Returns the value of a given base expression
//   taken to a given power. Otherwise returns a string
//   describing an error condition.
function pow(x, y) {
    if (x < 0 && !Number.isInteger(y)) {
        return constants.COMPLEX;
    }
    return Math.pow(x, y);
} 
// > square_root(number) -> number | string
//   Returns the square root of a non-negative number.
//   Otherwise returns a string describing an error condition.
function square_root(x) {
    if (x < 0) {
        return constants.COMPLEX;
    }
    return Math.sqrt(x);
}
// > percentage(number) -> number
//   Divides a given number by 100.
function percentage(x) {
    return x / 100;
}
// > factorial(number) -> number | string
//   Returns the factorial of a given integer. Otherwise returns
//   a string describing an error condition.
function factorial(x) {
    // Limit operation to prevent factorial blowup.
    // 18! < Number.MAX_SAFE_INTEGER < 19!
    const LIMIT = 18;
    if (x < 0 || !Number.isInteger(x)) {
        return constants.FACTORIAL_ERROR;
    }
    if (x > LIMIT) {
        return constants.OPERATION_RANGE;
    }
    if (x === 0) {
        return 1;
    }
    let product = 1;
    for (let i = 2; i <= x; i += 1) {
        product *= i;
    }
    return product;
}
// > unary_operation = { string: function(number) -> number }
//   Maps symbols to their associated unary operations.
const unary_operation = constants.freeze({
    [constants.ADD]: identity,
    [constants.SUBTRACT]: neg,
    [constants.SUBTRACT_ALT]: neg,
    [constants.SQUARE_ROOT]: square_root,
    [constants.PERCENTAGE]: percentage,
    [constants.FACTORIAL]: factorial,
});
// > binary_operation = { string: function(number, number) -> number }
//   Maps symbols to their associated binary operations.
const binary_operation = constants.freeze({
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
// > key_map = { string: string }
//   Maps input symbols to their associated output symbols.
const key_map = constants.freeze({
    " ": constants.SPACE,
    Space: constants.SPACE,
    Backspace: constants.DELETE,
    Clear: constants.CLEAR,
    Enter: constants.EQUAL,
    "√": constants.SQUARE_ROOT,
    "%": constants.PERCENTAGE,
    "!": constants.FACTORIAL,
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
    0: constants.ZERO,
    1: constants.ONE,
    2: constants.TWO,
    3: constants.THREE,
    4: constants.FOUR,
    5: constants.FIVE,
    6: constants.SIX,
    7: constants.SEVEN,
    8: constants.EIGHT,
    9: constants.NINE,
});
// > is_space(any) -> boolean
//   Is the provided input a whitespace character?
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
// > is_paren(any) -> boolean
//   Is the provided input an open or close parenthesis?
const is_paren = (function () {
    const set = new Set([constants.OPEN_PAREN, constants.CLOSE_PAREN]);
    return function (x) {
        return set.has(x);
    };
})();
// > is_exponent_suffix(any) -> boolean
//   Is the provide character either an uppercase or lowercase E?
//   Function is used in identifying the exponent suffix in a
//   floating-point string.
function is_exponent_suffix(x) {
    return x === constants.UPPER_E || x === constants.LOWER_E;
}
// > is_minus(any) -> boolean
//   Is the provided input the subtraction symbol,
//   U+2212 unicode minus or U+002d hyphen-minus?
const is_minus = (function () {
    const set = new Set([constants.SUBTRACT, constants.SUBTRACT_ALT]);
    return function (x) {
        return set.has(x);
    };
})();
// > is_plus-minus(any) -> boolean
//   Is the provided input either the addition or subtraction symbol?
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
// > is_digit(any) -> boolean
//   Is the provided input a denary digit?
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
// > is_operator(any) -> boolean
//   Is the provided input an operator symbol?
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
        constants.SQUARE_ROOT,
        constants.PERCENTAGE,
        constants.FACTORIAL,
    ]);
    return function (x) {
        return set.has(x);
    };
})();
// > is_ascii_letter(any) -> boolean
//   Is the provided input an ASCII letter?
const is_ascii_letter = (function () {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = lower.toUpperCase();
    const set = new Set([...lower].concat([...upper]));
    return function (x) {
        return set.has(x);
    };
})();

export default constants.freeze({
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
