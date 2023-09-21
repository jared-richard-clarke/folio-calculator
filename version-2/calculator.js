import constants from "./modules/constants.js";
import { format, parse } from "./modules/parser.js";
import utils from "./modules/utils.js";

// === CALCULATOR: components ===
const calculator = document.querySelector("[data-calculator]");
const output = calculator.querySelector("[data-calculator-output]");
const input = calculator.querySelector("[data-calculator-input]");
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
    methods.print = function () {
        return state.join("");
    };
    return Object.freeze(methods);
})();

function delegate(key, stack) {
    // === digits ===
    if (utils.is_digit(key)) {
        input.textContent = stack.pop().push(key, cursor).print();
        // === operators ===
    } else if (utils.is_operator(key)) {
        input.textContent = stack.pop().push(key, cursor).print();
        // === parentheses ===
    } else if (utils.is_paren(key)) {
        input.textContent = stack.pop().push(key, cursor).print();
        // === decimal point ===
    } else if (key === constants.DECIMAL_POINT) {
        input.textContent = stack.pop().push(key, cursor).print();
        // === space ===
    } else if (key === constants.SPACE) {
        input.textContent = stack
            .pop()
            .push(constants.WHITE_SPACE, cursor)
            .print();
        // === delete ===
    } else if (key === constants.DELETE) {
        if (stack.is_empty()) {
            return;
        }
        input.textContent = stack.pop().pop().push(cursor).print();
        // === clear ===
    } else if (key === constants.CLEAR) {
        if (!stack.is_empty()) {
            input.textContent = stack.clear().push(cursor).print();
        }
        // === equal ===
    } else if (key === constants.EQUAL) {
        const text = stack.pop().print();
        const [success, failure] = format(parse, text);
        // "innerText" preserves formatting.
        if (success !== null) {
            input.textContent = stack
                .clear()
                .push(...success, cursor)
                .print();
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
    // For accessibility, allow tab to use default behavior.
    if (event.key !== "Tab") {
        event.preventDefault();
    }
    if (!event.repeat) {
        const key = utils.key_map[event.key];
        if (key !== undefined) {
            delegate(key, stack);
        }
    }
});
