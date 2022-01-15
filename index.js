// === Calculator Program ===
import { ADD, SUB, MUL, IMP, LML, DIV, LDV, EXP, OPE, CLO } from "./modules/symbols.js"
import compute from "./modules/compute.js";
import utils from "./modules/utils.js";
import regex from "./modules/regex.js";
import { and, or } from "./modules/conditionals.js";

// map keys to presentational values.
const OPERATOR_MAP = Object.freeze({
    [ADD]: utils.pad(ADD),
    [SUB]: utils.pad(SUB),
    [LML]: utils.pad(MUL),
    [LDV]: utils.pad(DIV),
    [EXP]: utils.pad(EXP),
});
const PAREN_MAP = Object.freeze({
    [OPE]: utils.pad(OPE),
    [CLO]: utils.pad(CLO),
});
// Added lookup table to avoid endless conditionals.
const LOOKUP = Object.freeze({
    controls: ["negate", "delete", "clear"],
    operators: [ADD, SUB, LML, LDV, EXP],
    operands: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    parens: [OPE, CLO],
    decimal: ["."],
    equals: ["="],
});
const logic = {
    controls: function (text, key) {
        switch (key) {
            case "clear":
                output.textContent = regex.constants.DEFAULT_ZERO;
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
                    output.textContent = regex.constants.DEFAULT_ZERO;
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
    decimal: function (text, key) {
        if (or(!regex.is_trailing_digit(text), regex.is_decimal(text))) {
            return;
        } else {
            output.textContent += key;
        }
    },
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
            output.textContent = regex.constants.ZERO_ERROR;
            return;
        } else {
            const parsed = compute.parse(
                compute.tokenize(utils.insert_imp(text))
            );
            if (parsed === null) {
                output.textContent = regex.constants.PAREN_ERROR;
                return;
            } else {
                const result = compute.evaluate(parsed);
                if (utils.unsafe_number(result)) {
                    output.textContent = regex.constants.OVERFLOW_ERROR;
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
        logic.controls(text, key);
    } else if (LOOKUP.operators.includes(key)) {
        logic.operators(text, key);
    } else if (LOOKUP.operands.includes(key)) {
        logic.operands(text, key);
    } else if (LOOKUP.parens.includes(key)) {
        logic.parens(text, key);
    } else if (LOOKUP.decimal.includes(key)) {
        logic.decimal(text, key);
    } else if (LOOKUP.equals.includes(key)) {
        logic.equals(text);
    }
});
