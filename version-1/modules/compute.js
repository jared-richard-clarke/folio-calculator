import constants from "./constants.js";

const { OPE, CLO, EXP, IMP, MUL, DIV, ADD, SUB, PAREN_ERROR } = constants;

// const compute = readonly {
//   1. tokenize(string) -> [string, number]
//      Break string into array of operators(strings) and operands(numbers).
//      tokenize("1 + 1") -> [ 1, "+", 1 ]
//
//   2. parse([string, number]) -> [string, number] or PAREN_ERROR
//      Transform infix to postfix. Return PAREN_ERROR for mismatched parenthesis.
//      parse([ 1, "+", 1 ]) -> [ 1, 1, "+" ] or parse([ "(", 1, "+", 1 ]) -> PAREN_ERROR
//
//   3. evaluate([string, number]) -> number
//      Process postfix. Return sum.
//      evaluate([ 1, 1, "+" ]) -> 2
// }
// purpose: Module "compute" provides functions that tokenize, parse, and evaluate arithmetic expressions.

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
        // return postfix stack or PAREN_ERROR for mismatched parentheses
        if (mismatched_close_parens || mismatched_open_parens) {
            return PAREN_ERROR;
        } else {
            return output_stack;
        }
    }
    return parser;
})();
// 3. function evaluate
const evaluate = (function () {
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
                if (token === ADD) {
                    stack.push(operand1 + operand2);
                    return;
                }
                if (token === SUB) {
                    stack.push(operand1 - operand2);
                    return;
                }
                if (token === MUL || token === IMP) {
                    stack.push(operand1 * operand2);
                    return;
                }
                if (token === DIV) {
                    stack.push(operand1 / operand2);
                    return;
                }
                if (token === EXP) {
                    stack.push(operand1 ** operand2);
                    return;
                }
            }
        });
        return stack.pop();
    }
    return evaluator;
})();

export default Object.freeze({
    tokenize,
    parse,
    evaluate,
});
