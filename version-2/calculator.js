import constants from "./modules/constants.js";
import parse from "./modules/parser.js";
import tools from "./modules/tools.js";

// === CALCULATOR: components ===
const calculator = document.querySelector("[data-calculator='app']");
const output = calculator.querySelector("[data-calculator='output']");
const input = calculator.querySelector("[data-calculator='input']");

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
    methods.drop = function (x = 1) {
        let count = x;
        while (count > 0) {
            state.pop();
            count -= 1;
        }
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
    if (tools.is_digit(key)) {
        stack.drop().push(key, cursor);
        input.textContent = stack.print();
        // === operators ===
    } else if (tools.is_operator(key)) {
        stack.drop().push(key, cursor);
        input.textContent = stack.print();
        // === parentheses ===
    } else if (tools.is_paren(key)) {
        stack.drop().push(key, cursor);
        input.textContent = stack.print();
        // === decimal point ===
    } else if (key === constants.DECIMAL_POINT) {
        stack.drop().push(key, cursor);
        input.textContent = stack.print();
        // === space ===
    } else if (key === constants.SPACE) {
        stack.drop().push(constants.WHITE_SPACE, cursor);
        input.textContent = stack.print();
        // === delete ===
    } else if (key === constants.DELETE) {
        if (stack.is_empty()) {
            return;
        }
        stack.drop(2).push(cursor);
        input.textContent = stack.print();
        // === clear ===
    } else if (key === constants.CLEAR) {
        if (!stack.is_empty()) {
            stack.clear().push(cursor);
            input.textContent = stack.print();
        }
        // === equal ===
    } else if (key === constants.EQUAL) {
        const text = stack.drop().print();
        const [success, failure] = parse(text);
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
        const key = tools.key_map[event.key];
        if (key !== undefined) {
            delegate(key, stack);
        }
    }
});
