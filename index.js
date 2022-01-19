import {
    OPE,
    CLO,
    DEFAULT_ZERO,
    PAREN_ERROR,
    ZERO_ERROR,
    OVERFLOW_ERROR,
    OPERATOR_MAP,
    PAREN_MAP,
    LOOKUP,
} from "./modules/constants.js";
import compute from "./modules/compute.js";
import utils from "./modules/utils.js";
import regex from "./modules/regex.js";
import { and, or } from "./modules/conditionals.js";

// const delegate = {
//   1. controls(string, string) -> void
//      Delegates for control logic: clear, delete, negate.
//
//   2. operators(string, string) -> void
//      Delegates for operator logic: +, -, *, /, **.
//
//   3. operands(string, string) -> void
//      Delegates for operand logic: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.
//
//   4. parens(string, string) -> void
//      Delegates for paren logic: (, ).
//
//   5. decimal(string, string) -> void
//      Delegates for decimal logic: [ . ].
//
//   6. equals(string, string) -> void
//      Delegates for equals logic: [ = ].
// }
// purpose: delegate contains methods that choose functionality based on user input.

const delegate = {
    // 1. function controls
    controls: function (text, key) {
        switch (key) {
            case "clear":
                output.textContent = DEFAULT_ZERO;
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
                    output.textContent = DEFAULT_ZERO;
                    return;
                } else {
                    output.textContent = utils.delete_char(text);
                    return;
                }
            case "negate":
                if (regex.is_trailing_digit(text)) {
                    output.textContent = utils.negate_num_char(text);
                    return;
                } else {
                    return;
                }
        }
    },
    // 2. function operators
    operators: function (text, key) {
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
            output.textContent += OPERATOR_MAP[key];
        }
    },
    // 3. function operands
    operands: function (text, key) {
        if (
            or(
                regex.is_default_zero(text),
                regex.is_zero_error(text),
                regex.is_paren_error(text),
                regex.is_overflow_error(text)
            )
        ) {
            output.textContent = key;
            return;
        } else if (regex.is_trailing_zero(text)) {
            output.textContent = utils.replace_end(text, key);
            return;
        } else {
            output.textContent += key;
        }
    },
    // 4. function parens
    parens: function (text, key) {
        if (
            and(
                key === CLO,
                or(regex.is_trailing_operator(text), regex.is_open_paren(text))
            )
        ) {
            return;
        } else if (and(key === OPE, regex.is_default_zero(text))) {
            output.textContent = PAREN_MAP[key];
            return;
        } else {
            output.textContent += PAREN_MAP[key];
        }
    },
    // 5. function decimal
    decimal: function (text, key) {
        if (or(!regex.is_trailing_digit(text), regex.is_decimal(text))) {
            return;
        } else {
            output.textContent += key;
        }
    },
    // 6. function equals
    equals: function (text) {
        if (
            or(
                regex.is_paren_error(text),
                regex.is_zero_error(text),
                regex.is_overflow_error(text),
                regex.is_trailing_operator(text),
                regex.is_trailing_decimal(text)
            )
        ) {
            return;
        } else if (regex.is_divide_by_zero(text)) {
            output.textContent = ZERO_ERROR;
            return;
        } else {
            const parsed = compute.parse(
                compute.tokenize(utils.insert_imp(text))
            );
            if (parsed === PAREN_ERROR) {
                output.textContent = PAREN_ERROR;
                return;
            } else {
                const result = compute.evaluate(parsed);
                if (utils.unsafe_number(result)) {
                    output.textContent = OVERFLOW_ERROR;
                    return;
                } else {
                    output.textContent = String(result);
                }
            }
        }
    },
};
// === CALCULATOR ===
const calculator = document.querySelector("[data-calculator]");
// === CALCULATOR: components ===
// | ----------- mutate this data structure -----------|
const output = calculator.querySelector("[data-output]");
// | --------------------------------------------------|

// === CALCULATOR: events ===
calculator.addEventListener("click", (event) => {
    const text = output.textContent;
    const key = event.target.value;
    // event delegation
    if (key === undefined) {
        return;
    } else if (LOOKUP.controls.includes(key)) {
        delegate.controls(text, key);
    } else if (LOOKUP.operators.includes(key)) {
        delegate.operators(text, key);
    } else if (LOOKUP.operands.includes(key)) {
        delegate.operands(text, key);
    } else if (LOOKUP.parens.includes(key)) {
        delegate.parens(text, key);
    } else if (LOOKUP.decimal.includes(key)) {
        delegate.decimal(text, key);
    } else if (LOOKUP.equals.includes(key)) {
        delegate.equals(text);
    }
});
