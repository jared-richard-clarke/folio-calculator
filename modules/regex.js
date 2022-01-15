import { DIV, OPERATORS } from "./symbols.js";

// const regex = readonly {
//   1. is_trailing_operator(string) -> boolean
//      Is there a trailing operator?
//      is_trailing_operator("1 + ") -> true
//
//   2. is_open_paren(string) -> boolean
//      Is their an open parenthesis at end of string?
//      is_open_paren("1 + 1 ( ") -> true
//
//   3. is_default_zero(string) -> boolean
//      Is the expression "0"?
//      is_default_zero("0") -> true
//
//   4. is_trailing_zero(string) -> boolean
//      Is number 0 at end of string?
//      is_trailing_zero("1 + 0") -> true
//
//   5. is_decimal(string) -> boolean
//      Does number have decimal point?
//      is_decimal("1.5") -> true
//
//   6. is_trailing_decimal(string) -> boolean
//      Does expression have a trailing decimal point?
//      is_trailing_decimal("1.") -> true
//
//   7. is_trailing_digit(string) -> boolean
//      Does expression end with number?
//      is_trailing_digit("1 + 1") -> true
//
//   8. is_divide_by_zero(string) -> boolean
//      Does expression have divide-by-zero errors?
//      is_divide_by_zero("1 ÷ 0") -> true
//
//   9. is_paren_error(string) -> boolean
//      Is expression the PAREN_ERROR constant?
//      is_paren_error(PAREN_ERROR) -> true
//
//  10. is_zero_error(string) -> boolean
//      Is expression ZERO_ERROR constant?
//      is_zero_error(ZERO_ERROR) -> true
//
//  11. is_overflow_error(string) -> boolean
//      Is expression OVERFLOW_ERROR constant?
//      is_overflow_error(OVERFLOW_ERROR) -> true
//
//  12. is_single_char(string) -> boolean
//      Is expression one character?
//      is_single_char("1") -> true
// }
// purpose: "regex" acts as module, providing regular-expressions for examining calculator input.

const constants = Object.freeze({
    DEFAULT_ZERO: "0",
    ZERO_ERROR: "Cannot divide by zero.",
    PAREN_ERROR: "Mismatched parentheses.",
    OVERFLOW_ERROR: "Number outside safe range.",
});
// regular expressions
const DEFAULT_ZERO = new RegExp("^" + constants.DEFAULT_ZERO + "$");
const ZERO_ERROR = new RegExp("^" + constants.ZERO_ERROR + "$");
const PAREN_ERROR = new RegExp("^" + constants.PAREN_ERROR + "$");
const OVERFLOW_ERROR = new RegExp("^" + constants.OVERFLOW_ERROR + "$");
const TRAILING_OPERATOR = new RegExp("[" + OPERATORS + "]\\s$"); // /[-+×÷^]\s$/;
const OPEN_PARENTHESIS = /\s\(\s$/;
const TRAILING_ZERO = new RegExp("[" + OPERATORS + "]\\s0$"); // /[-+×÷^]\s0$/;
const DECIMAL = /\d+\.\d+$/;
const TRAILING_DECIMAL = /\d\.$/;
const TRAILING_DIGIT = /\d$/;
const DIVIDE_BY_ZERO = new RegExp("\\s" + DIV + "\\s0"); // /\s÷\s0/;
// check_text(regex) -> function(text) -> boolean
function check_text(regex) {
    return function (text) {
        return regex.test(text);
    };
}
function is_single_char(text) {
    return /^-\d$/.test(text) || text.length === 1;
}
export default Object.freeze({
    constants,
    is_trailing_operator: check_text(TRAILING_OPERATOR),
    is_open_paren: check_text(OPEN_PARENTHESIS),
    is_default_zero: check_text(DEFAULT_ZERO),
    is_trailing_zero: check_text(TRAILING_ZERO),
    is_decimal: check_text(DECIMAL),
    is_trailing_decimal: check_text(TRAILING_DECIMAL),
    is_trailing_digit: check_text(TRAILING_DIGIT),
    is_divide_by_zero: check_text(DIVIDE_BY_ZERO),
    is_paren_error: check_text(PAREN_ERROR),
    is_zero_error: check_text(ZERO_ERROR),
    is_overflow_error: check_text(OVERFLOW_ERROR),
    is_single_char,
});
