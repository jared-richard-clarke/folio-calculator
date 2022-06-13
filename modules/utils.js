// const utils = readonly {
//   1. negate_num_char(string) -> string
//      Flip sign of numerical string.
//      negate_num_char("-1") -> "1" or negate_num_char("1") -> "-1"
//
//   2. unsafe_number(number) -> boolean
//      Determines whether number is within JavaScript's safe numerical range.
//      unsafe_number(Number.MAX_SAFE_INTEGER + 1) -> true
//
//   3. fix_point(number) -> number
//      Rounds number to within 15 decimal points of precision.
//      fix_point(0.19999999999999998) -> 0.2
//
//   4. insert_imp(string) -> string
//      Insert implied multiplication symbol into arithmetic expression prior to evaluation.
//      insert_imp("2 ( 2 )") -> "2 imp-× ( 2 )"
//
//   5. replace_end(string, string) -> string
//      Replaces number 0 with number 1-9 if 0 follows operator. Prevents malformed expressions like 1 ÷ 05.
//      replace_end("1 ÷ 0", "5") -> "1 ÷ 5"
//
//   6. delete_item(string) -> string
//      Deletes item at end of string.
//      delete_item("1 + 1") -> "1 + "
// }
// purpose: Module "utils" provides utility functions for string and number manipulation.

// 1. function negate_num_char
const negate_num_char = (function () {
    const NUM_CHAR = /-?(\d+|\d+\.\d+)$/;
    function negate(num_text) {
        if (Number(num_text) === 0) {
            return num_text;
        }
        return String(-Number(num_text));
    }
    return function (text) {
        return text.replace(NUM_CHAR, (match) => {
            return negate(match);
        });
    };
})();
// 2. function unsafe_number
function unsafe_number(number) {
    return Math.abs(number) >= Number.MAX_SAFE_INTEGER;
}
// 3. function fix_point
function fix_point(sum) {
    const DECIMAL_PRECISION = 15;
    return Number(sum.toFixed(DECIMAL_PRECISION));
}
// 4. function insert_imp
const insert_imp = (function () {
    // whitespace padding important.
    const IMPLIED_MULTIPLIER = " imp-× ";
    function insert(regex) {
        return function (text) {
            return text.replace(regex, (match, p1, p2) => {
                return [p1, IMPLIED_MULTIPLIER, p2].join("");
            });
        };
    }
    const before = insert(/(\d)\s(\()/g);
    const between = insert(/(\))\s{2}(\()/g);
    const after = insert(/(\))\s(\d)/g);
    // interface
    return function (text) {
        return after(between(before(text)));
    };
})();
// 5. function replace_end
function replace_end(text, char) {
    const substring = text.substring(0, text.length - 1);
    return substring + char;
}
// 6. function delete_item
function delete_item(text) {
    // use [×^÷+-] literals instead of OPERATORS constant. "new Regular expression" syntax overly complicated.
    return text.replace(/\s[()]\s$|\s[×^÷+-]\s$|\-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?$/, "");
}

export default Object.freeze({
    negate_num_char,
    unsafe_number,
    fix_point,
    insert_imp,
    replace_end,
    delete_item,
});
