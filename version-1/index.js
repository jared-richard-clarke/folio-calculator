import constants from "./modules/constants.js";
import delegate from "./modules/delegate.js";

const { LOOKUP } = constants;

// === CALCULATOR: components ===
const calculator = document.querySelector("[data-calculator]");
// | ----------- mutate this data structure -----------|
const output = calculator.querySelector("[data-output]");
// | --------------------------------------------------|

// === CALCULATOR: events ===
calculator.addEventListener("click", function (event) {
    const text = output.textContent;
    const key = event.target.value;
    // event delegation
    if (key === undefined) {
        return;
    } else if (LOOKUP.controls.includes(key)) {
        delegate.controls(text, key, output);
    } else if (LOOKUP.operators.includes(key)) {
        delegate.operators(text, key, output);
    } else if (LOOKUP.operands.includes(key)) {
        delegate.operands(text, key, output);
    } else if (LOOKUP.parens.includes(key)) {
        delegate.parens(text, key, output);
    } else if (LOOKUP.decimal.includes(key)) {
        delegate.decimal(text, key, output);
    } else if (LOOKUP.equals.includes(key)) {
        delegate.equals(text, output);
    } else {
        return;
    }
});
