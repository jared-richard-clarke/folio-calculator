// > freeze(object) -> ReadOnly object
//   where prototype = null
//
//   Transforms an object of key-value pairs into a read-only
//   object of key-value pairs absent a prototypal chain.
//
//   Side Note: Only the properties of the immediate object
//              are made immutable.
function freeze(object) {
    return Object.freeze(
        Object.entries(object).reduce(function (block, [key, value]) {
            block[key] = value;
            return block;
        }, Object.create(null))
    );
}

export default freeze({
    freeze,
    // === spaces ===
    WHITE_SPACE: " ",
    TAB: "\t",
    LINEFEED: "\n",
    CARRIAGE_RETURN: "\r",
    VERTICAL_TAB: "\v",
    FORM_FEED: "\f",
    // === general symbols ===
    DECIMAL_POINT: ".",
    OPEN_PAREN: "(",
    CLOSE_PAREN: ")",
    UPPER_E: "E",
    LOWER_E: "e",
    NAN: "NaN",
    UNDEFINED: "undefined",
    INFINITY: "Infinity",
    // === controls ===
    SPACE: "space",
    CLEAR: "clear",
    DELETE: "delete",
    EQUAL: "=",
    // === end-of-input flag ===
    EOF: "eof",
    // === digits ===
    ZERO: "0",
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    // === operators ===
    ADD: "+",
    // U+2212: unicode minus
    SUBTRACT: "−",
    // U+002d: hyphen-minus
    SUBTRACT_ALT: "-",
    // U+00d7: multiplication
    MULTIPLY: "×",
    MULTIPLY_ALT: "*",
    IMPLIED_MULTIPLY: "imp-x",
    DIVIDE: "÷",
    DIVIDE_ALT: "/",
    EXPONENT: "^",
    SQUARE_ROOT: "√",
    PERCENTAGE: "%",
    FACTORIAL: "!",
    // === token labels ===
    NUMBER: "number",
    ERROR: "error",
    // === errors ===
    // Right padding added for formatting.
    FACTORIAL_ERROR: "Takes only non-negative integers. ",
    NUMBER_RANGE: "Number outside range. ",
    OPERATION_RANGE: "Operation outside number range. ",
    DIVIDE_ZERO: "Cannot divide by zero. ",
    COMPLEX: "Creates complex number. ",
    UNKNOWN: "Unknown identifier. ",
    LEADING_ZERO: "Leading zero. ",
    MISPLACED_NUMBER: "Dangling digit. ",
    MISPLACED_DECIMAL: "Misplaced decimal. ",
    MISPLACED_EXPONENT: "Misplaced exponent suffix. ",
    MISPLACED_OPERATOR: "Dangling operator. ",
    NOT_NUMBER: "Not a number. ",
    NOT_PREFIX: "Not a prefix operation. ",
    NOT_INFIX: "Not an infix operation. ",
    EMPTY_EXPRESSION: "Empty expression. ",
    INCOMPLETE_EXPRESSION: "Incomplete expression. ",
    MISMATCHED_PAREN: "Mismatched parenthesis. ",
    EMPTY_PARENS: "Empty parentheses. ",
});
