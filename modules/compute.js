import { ADD, SUB, MUL, IMP, DIV, EXP, OPE, CLO } from "./symbols.js";
// const compute = readonly {
//   1. tokenize(string) -> [string, number]
//      Break string into array of operators as strings and operands as numbers.
//
//   2. parse([string, number]) -> [string, number] or null if mismatched parentheses
//      Transform infix to postfix. Check for mismatched parenthesis.
//
//   3. evaluate([string, number]) -> number
//      Process postfix. Return sum.
// }
// purpose: "compute" module provides functions that evaluate arithmetic expressions.

// 1. function tokenize
function tokenize(text) {
    return text.split(" ").map((token) => {
        return /\d+/.test(token) ? Number(token) : token;
    });
}
// 2. function parse
const parse = (function () {
    const parenthesis = {
        open: OPE,
        close: CLO,
    };
    // imp-×: implied multiplication,
    // which has higher predence than explicit multiplication.
    const operators = [EXP, IMP, MUL, DIV, ADD, SUB];
    const precedence = {
        [EXP]: 4,
        [IMP]: 3,
        [MUL]: 2,
        [DIV]: 2,
        [ADD]: 1,
        [SUB]: 1,
    };
    const associativity = {
        [EXP]: "right",
        [IMP]: "left",
        [MUL]: "left",
        [DIV]: "left",
        [ADD]: "left",
        [SUB]: "left",
    };
    // helper functions
    function peek(stack) {
        return stack[stack.length - 1];
    }
    function empty(stack) {
        return stack.length === 0;
    }

    function parser(infix) {
        // variables
        const output_stack = [];
        const operator_stack = [];
        // error flags
        let mismatched_close_parens = false;
        let mismatched_open_parens = false;
        // === iteration ===
        infix.forEach((token) => {
            // if token operand.
            if (typeof token === "number") {
                output_stack.push(token);
                // if token operator.
            } else if (operators.find((value) => value === token)) {
                let top = peek(operator_stack);
                while (
                    precedence[token] <= precedence[top] &&
                    associativity[token] === "left"
                ) {
                    output_stack.push(operator_stack.pop());
                    // prepare for next loop.
                    top = peek(operator_stack);
                }
                operator_stack.push(token);
                // if open parenthesis.
            } else if (token === parenthesis.open) {
                operator_stack.push(token);
                // if close parenthesis.
            } else if (token === parenthesis.close) {
                while (peek(operator_stack) !== parenthesis.open) {
                    // error flag for mismatched parenthesis
                    if (empty(operator_stack)) {
                        mismatched_close_parens = true;
                        break;
                    } else {
                        output_stack.push(operator_stack.pop());
                    }
                }
                // discard open parentheses.
                operator_stack.pop(); // returns "undefined" if empty.
            }
        });
        // === Housekeeping ===
        // add remaining operators to output stack
        while (operator_stack.length > 0) {
            output_stack.push(operator_stack.pop());
        }
        // check for remaining open parentheses.
        if (output_stack.includes(OPE)) {
            mismatched_open_parens = true;
        }
        // === Return Value ===
        // return postfix stack or mismatched parentheses error
        if (mismatched_close_parens || mismatched_open_parens) {
            return null;
        } else {
            return output_stack;
        }
    }
    return parser;
})();
// 3. function evaluate
const evaluate = (function () {
    const operations = (function () {
        function add(x, y) {
            return x + y;
        }
        function subtract(x, y) {
            return x - y;
        }
        function multiply(x, y) {
            return x * y;
        }
        function divide(x, y) {
            return x / y;
        }
        function exponent(x, y) {
            return x ** y;
        }
        function fix_point(sum) {
            const DECIMAL_PRECISION = 15;
            return Number(sum.toFixed(DECIMAL_PRECISION));
        }
        return Object.freeze({
            add,
            subtract,
            multiply,
            divide,
            exponent,
            fix_point,
        });
    })();
    function evaluator(postfix) {
        const stack = [];
        let operand1 = 0;
        let operand2 = 0;
        postfix.forEach((token) => {
            if (typeof token === "number") {
                stack.push(token);
            } else {
                operand2 = stack.pop();
                operand1 = stack.pop();
                switch (token) {
                    case ADD:
                        return stack.push(operations.add(operand1, operand2));
                    case SUB:
                        return stack.push(
                            operations.subtract(operand1, operand2)
                        );
                    case MUL:
                    case IMP:
                        return stack.push(
                            operations.multiply(operand1, operand2)
                        );
                    case DIV:
                        return stack.push(
                            operations.divide(operand1, operand2)
                        );
                    case EXP:
                        return stack.push(
                            operations.exponent(operand1, operand2)
                        );
                }
            }
        });
        return operations.fix_point(stack.pop());
    }
    return evaluator;
})();

export default Object.freeze({
    tokenize,
    parse,
    evaluate,
});
