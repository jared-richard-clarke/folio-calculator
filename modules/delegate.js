import constants from "./constants.js";
import compute from "./compute.js";
import regex from "./regex.js";
import utils from "./utils.js";
import conditionals from "./conditionals.js";

// destructure and/or functions from conditionals.
const { and, or } = conditionals;

// const delegate = readonly {
//   1. controls(string, string, string) -> void
//      Delegates for control events: clear, delete, negate.
//
//   2. operators(string, string, string) -> void
//      Delegates for operator events: +, -, *, /, **.
//
//   3. operands(string, string, string) -> void
//      Delegates for operand events: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.
//
//   4. parens(string, string, string) -> void
//      Delegates for paren events: (, ).
//
//   5. decimal(string, string, string) -> void
//      Delegates for decimal event: [ . ].
//
//   6. equals(string, string) -> void
//      Delegates for equals event: [ = ].
// }
// purpose: delegate provides methods according to user input.

const delegate = {
    // 1. function controls
    controls: function (text, key, element) {
        switch (key) {
            case "clear":
                element.textContent = constants.DEFAULT_ZERO;
                return;
            case "delete":
                if (regex.is_default_zero(text)) {
                    return;
                } else if (
                    or(
                        regex.is_single_char(text),
                        regex.is_paren_error(text),
                        regex.is_zero_error(text),
                        regex.is_overflow_error(text)
                    )
                ) {
                    element.textContent = constants.DEFAULT_ZERO;
                    return;
                } else {
                    element.textContent = utils.delete_char(text);
                    return;
                }
            case "negate":
                if (regex.is_trailing_digit(text)) {
                    element.textContent = utils.negate_num_char(text);
                    return;
                } else {
                    return;
                }
        }
    },
    // 2. function operators
    operators: function (text, key, element) {
        if (
            or(
                regex.is_trailing_operator(text),
                regex.is_open_paren(text),
                regex.is_paren_error(text),
                regex.is_zero_error(text),
                regex.is_overflow_error(text)
            )
        ) {
            return;
        } else {
            element.textContent += constants.OPERATOR_MAP[key];
        }
    },
    // 3. function operands
    operands: function (text, key, element) {
        if (
            or(
                regex.is_default_zero(text),
                regex.is_zero_error(text),
                regex.is_paren_error(text),
                regex.is_overflow_error(text)
            )
        ) {
            element.textContent = key;
            return;
        } else if (regex.is_trailing_zero(text)) {
            element.textContent = utils.replace_end(text, key);
            return;
        } else {
            element.textContent += key;
        }
    },
    // 4. function parens
    parens: function (text, key, element) {
        if (
            and(
                key === constants.CLO,
                or(regex.is_trailing_operator(text), regex.is_open_paren(text))
            )
        ) {
            return;
        } else if (and(key === constants.OPE, regex.is_default_zero(text))) {
            element.textContent = constants.PAREN_MAP[key];
            return;
        } else {
            element.textContent += constants.PAREN_MAP[key];
        }
    },
    // 5. function decimal
    decimal: function (text, key, element) {
        if (or(!regex.is_trailing_digit(text), regex.is_decimal(text))) {
            return;
        } else {
            element.textContent += key;
        }
    },
    // 6. function equals
    equals: function (text, element) {
        if (
            or(
                regex.is_paren_error(text),
                regex.is_zero_error(text),
                regex.is_overflow_error(text),
                regex.is_trailing_operator(text)
            )
        ) {
            return;
        } else if (regex.is_divide_by_zero(text)) {
            element.textContent = constants.ZERO_ERROR;
            return;
        } else {
            const parsed = compute.parse(
                compute.tokenize(utils.insert_imp(text))
            );
            if (parsed === constants.PAREN_ERROR) {
                element.textContent = constants.PAREN_ERROR;
                return;
            } else {
                const result = compute.evaluate(parsed);
                if (utils.unsafe_number(result)) {
                    element.textContent = constants.OVERFLOW_ERROR;
                    return;
                } else {
                    element.textContent = String(
                        utils.fix_point(result)
                    );
                }
            }
        }
    },
};

export default Object.freeze(delegate);
