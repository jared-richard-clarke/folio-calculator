// const utils = readonly {
//   1. negate_num_char(string) -> string
//      Flip sign of numerical string.
//
//   2. unsafe_number(number) -> boolean
//      Determines whether number is within JavaScript's safe numerical range.
//
//   3. pad(string) -> string
//      Add whitespace character to start and end of string.
//
//   4. insert_imp(string) -> string
//      Insert implied multiplication symbol into arithmetic expression prior to evaluation.
//
//   5. replace_end(string) -> string
//      Replaces number 0 with number 1-9 if 0 follows operator. Prevents malformed expressions like 1 ÷ 05.
//
//   6. delete_char(string) -> string
//      Deletes character at end of string.
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
// 3. function pad
function pad(text) {
    return " " + text + " ";
}
// 4. function insert_imp
const insert_imp = (function () {
    const IMPLIED_MULTIPLIER = pad("imp-×");
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
// 6. function delete_char
function delete_char(text) {
    return text.replace(/\s[()]\s$|\s[×^÷+-]\s$|\.$|\-?\d$/, "");
}

export default Object.freeze({
    negate_num_char,
    unsafe_number,
    pad,
    insert_imp,
    replace_end,
    delete_char,
});