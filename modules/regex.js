import constants from "./constants.js";

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
//  13. is_single_number(string) -> boolean
//      Is expression single number?
//      is_single_num("1.02") -> true
// }
// purpose: module regex provides regular-expressions for examining calculator input.

// regular expressions
const DEF_ZERO = new RegExp("^" + constants.DEFAULT_ZERO + "$");
const ZERO_ERROR = new RegExp("^" + constants.ZERO_ERROR + "$");
const PAREN_ERROR = new RegExp("^" + constants.PAREN_ERROR + "$");
const OVERFLOW_ERROR = new RegExp("^" + constants.OVERFLOW_ERROR + "$");
const TRAILING_OPERATOR = new RegExp("[" + constants.OPERATORS + "]\\s$"); // /[-+×÷^]\s$/;
const OPEN_PARENTHESIS = /\s\(\s$/;
const TRAILING_ZERO = new RegExp("[" + constants.OPERATORS + "]\\s0$"); // /[-+×÷^]\s0$/;
const DECIMAL = /\d+\.\d+$/;
const TRAILING_DECIMAL = /\d\.$/;
const TRAILING_DIGIT = /\d$/;
// Use literal regular expression. "new Regular expression" syntax overly complicated for this use case.
const DIVIDE_BY_ZERO = /\s÷\s0\.?0*$/;

function check_text(regex) {
    return function (text) {
        return regex.test(text);
    };
}
function is_single_number(text) {
    return /^\-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?$/.test(text);
}
export default Object.freeze({
    // 1. function is_trailing_operator
    is_trailing_operator: check_text(TRAILING_OPERATOR),
    // 2. function is_open_paren
    is_open_paren: check_text(OPEN_PARENTHESIS),
    // 3. function is_default_zero
    is_default_zero: check_text(DEF_ZERO),
    // 4. function is_trailing_zero
    is_trailing_zero: check_text(TRAILING_ZERO),
    // 5. function is_decimal
    is_decimal: check_text(DECIMAL),
    // 6. function is_trailing_decimal
    is_trailing_decimal: check_text(TRAILING_DECIMAL),
    // 7. function is_trailing_digit
    is_trailing_digit: check_text(TRAILING_DIGIT),
    // 8. function is_divide_by_zero
    is_divide_by_zero: check_text(DIVIDE_BY_ZERO),
    // 9. function is_paren_error
    is_paren_error: check_text(PAREN_ERROR),
    // 10. function is_zero_error
    is_zero_error: check_text(ZERO_ERROR),
    // 11. function is_overflow_error
    is_overflow_error: check_text(OVERFLOW_ERROR),
    // 12. function is_single_number
    is_single_number,
});
