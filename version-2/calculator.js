import constants from "./modules/constants.js";
import { format, parse } from "./modules/parser.js";
import utils from "./modules/utils.js";

// === CALCULATOR: components ===
const calculator = document.querySelector("[data-calculator]");
const output = document.querySelector("[data-calculator-output]");
const input = document.querySelector("[data-calculator-input]");
const cursor = "|";
// Programmatically set cursor to show JavaScript is active.
input.textContent = cursor;

const stack = (function () {
    const state = [cursor];
    const methods = Object.create(null);

    methods.is_empty = function () {
        return state.length === 1;
    };
    methods.push = function (...xs) {
        state.push(...xs);
        return methods;
    };
    methods.pop = function () {
        state.pop();
        return methods;
    };
    methods.clear = function () {
        while (state.length > 0) {
            state.pop();
        }
        return methods;
    };
    methods.to_string = function () {
        return state.join("");
    };
    return Object.freeze(methods);
})();

function delegate(key, stack) {
    // === digits ===
    if (utils.is_digit(key)) {
        input.textContent = stack.pop().push(key, cursor).to_string();
        // === operators ===
    } else if (utils.is_operator(key)) {
        input.textContent = stack.pop().push(key, cursor).to_string();
        // === parentheses ===
    } else if (utils.is_paren(key)) {
        input.textContent = stack.pop().push(key, cursor).to_string();
        // === decimal point ===
    } else if (key === constants.DECIMAL_POINT) {
        input.textContent = stack.pop().push(key, cursor).to_string();
        // === space ===
    } else if (key === constants.SPACE) {
        input.textContent = stack.pop().push(constants.WHITE_SPACE, cursor)
            .to_string();
        // === delete ===
    } else if (key === constants.DELETE) {
        if (stack.is_empty()) {
            return;
        }
        input.textContent = stack.pop().pop().push(cursor).to_string();
        // === clear ===
    } else if (key === constants.CLEAR) {
        if (!stack.is_empty()) {
            input.textContent = stack.clear().push(cursor).to_string();
        }
        // === equal ===
    } else if (key === constants.EQUAL) {
        const text = stack.pop().to_string();
        const [success, failure] = format(parse, text);
        // "innerText" preserves formatting.
        if (success !== null) {
            input.textContent = stack.clear().push(...success, cursor)
                .to_string();
            output.innerText = success + "\n=\n" + text;
            return;
        }
        output.innerText = failure;
        stack.push(cursor);
        // === default ===
    } else {
        return;
    }
}

// === CALCULATOR: events ===
calculator.addEventListener("click", function (event) {
    const key = event.target.value;
    if (key !== undefined) {
        delegate(key, stack);
    }
});

calculator.addEventListener("keydown", function (event) {
    if (!event.repeat) {
        const key = utils.key_map[event.key];
        if (key !== undefined) {
            delegate(key, stack);
        }
    }
});
