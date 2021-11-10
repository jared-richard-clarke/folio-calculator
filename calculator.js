(function () {
    // === CALCULATOR: modules ===
    // === module compute ===
    const compute = (function () {
        function tokenize(text) {
            return text.split(" ").map((token) => {
                return /\d+/.test(token) ? Number(token) : token;
            });
        }
        const parse = (function () {
            // constants
            const parenthesis = {
                open: "(",
                close: ")",
            };
            // imp-×: implied multiplication,
            // which has higher predence than explicit multiplication.
            const operators = ["^", "imp-×", "×", "÷", "+", "-"];
            const precedence = {
                "^": 4,
                "imp-×": 3,
                "×": 2,
                "÷": 2,
                "+": 1,
                "-": 1,
            };
            const associativity = {
                "^": "right",
                "imp-×": "left",
                "×": "left",
                "÷": "left",
                "+": "left",
                "-": "left",
            };
            // helper functions
            function peek(stack) {
                return stack[stack.length - 1];
            }
            function empty(stack) {
                return stack.length === 0;
            }
            // parse([ numbers and strings ]) -> [ numbers and strings ] or null
            // Transform infix to postfix. Check for mismatched parenthesis.
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
                if (output_stack.includes("(")) {
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
        const evaluate = (function () {
            // operations
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
                    return Number(sum.toFixed(7));
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

            // evaluate([ numbers | strings ]) -> number
            // Process postfix. Return sum.
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
                            case "+":
                                return stack.push(
                                    operations.add(operand1, operand2)
                                );
                            case "-":
                                return stack.push(
                                    operations.subtract(operand1, operand2)
                                );
                            case "×":
                            case "imp-×":
                                return stack.push(
                                    operations.multiply(operand1, operand2)
                                );
                            case "÷":
                                return stack.push(
                                    operations.divide(operand1, operand2)
                                );
                            case "^":
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
        return Object.freeze({
            tokenize,
            parse,
            evaluate,
        });
    })();
    // === module utils ===
    const utils = (function () {
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
        function unsafe_number(number) {
            return Math.abs(number) >= Number.MAX_SAFE_INTEGER;
        }
        function pad(text) {
            return " " + text + " ";
        }
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
        function replace_end(text, char) {
            const substring = text.substring(0, text.length - 1);
            return substring + char;
        }
        // "(", ")", "^", "×", "÷", "+", "-",
        function delete_char(text) {
            return text.replace(/\s[()]\s$|\s[×^÷+-]\s$|\.$|\-?\d$/, "");
        }
        return Object.freeze({
            negate_num_char,
            unsafe_number,
            pad,
            insert_imp,
            replace_end,
            delete_char,
        });
    })();
    // === module constants ===
    const constants = Object.freeze({
        DEFAULT_ZERO: "0",
        ZERO_ERROR: "Cannot divide by zero.",
        PAREN_ERROR: "Mismatched parentheses.",
        OVERFLOW_ERROR: "Number outside safe range.",
    });
    // === module regex === 
    const regex = (function () {
        // regular expressions
        const DEFAULT_ZERO = new RegExp("^" + constants.DEFAULT_ZERO + "$");
        const ZERO_ERROR = new RegExp("^" + constants.ZERO_ERROR + "$");
        const PAREN_ERROR = new RegExp("^" + constants.PAREN_ERROR + "$");
        const OVERFLOW_ERROR = new RegExp("^" + constants.OVERFLOW_ERROR + "$");
        const TRAILING_OPERATOR = /[-+×÷^]\s$/;
        const OPEN_PARENTHESIS = /\s\(\s$/;
        const TRAILING_ZERO = /[-+×÷^]\s0$/;
        const DECIMAL = /\d+\.\d+$/;
        const TRAILING_DECIMAL = /\d\.$/;
        const TRAILING_DIGIT = /\d$/;
        const DIVIDE_BY_ZERO = /\s÷\s0/;
        // check_text(regex) -> function(text) -> boolean
        function check_text(regex) {
            return function (text) {
                return regex.test(text);
            };
        }
        function is_single_char(text) {
            return /^-\d$/.test(text) || text.length === 1;
        }
        // interface
        return Object.freeze({
            is_trailing_operator: check_text(TRAILING_OPERATOR),
            is_open_paren: check_text(OPEN_PARENTHESIS),
            is_default_zero: check_text(DEFAULT_ZERO),
            is_trailing_zero: check_text(TRAILING_ZERO),
            is_decimal: check_text(DECIMAL),
            is_trailing_decimal: check_text(TRAILING_DECIMAL),
            is_trailing_digit: check_text(TRAILING_DIGIT),
            is_divide_by_zero: check_text(DIVIDE_BY_ZERO),
            is_paren_error: check_text(PAREN_ERROR),
            is_zero_error: check_text(ZERO_ERROR),
            is_overflow_error: check_text(OVERFLOW_ERROR),
            is_single_char,
        });
    })();
    const conditionals = (function () {
        const edge_cases = new Map([
            [0, true],
            [-0, false],
            [Number.POSITIVE_INFINITY, false],
            [Number.NEGATIVE_INFINITY, false],
            ["", true],
            [/s+/g, true],
            [NaN, false],
            [undefined, false],
            [null, false],
        ]);
        // and(...expressions) -> boolean
        function and(...expressions) {
            return expressions.every((value) => {
                return edge_cases.has(value) ? edge_cases.get(value) : value;
            });
        }
        // or(...expressions) -> boolean
        function or(...expressions) {
            return expressions.some((value) => {
                return edge_cases.has(value) ? edge_cases.get(value) : value;
            });
        }
        // interface: const { and, or } = conditionals;
        return Object.freeze({
            and,
            or,
        });
    })();
    // === end of modules ===
    // === CALCULATOR: variables ===
    const OPERATOR_MAP = Object.freeze({
        "+": utils.pad("+"),
        "-": utils.pad("-"),
        "*": utils.pad("×"),
        "/": utils.pad("÷"),
        "^": utils.pad("^"),
    });
    const PAREN_MAP = Object.freeze({
        "(": utils.pad("("),
        ")": utils.pad(")"),
    });
    // Added lookup table to avoid endless conditionals.
    const LOOKUP = Object.freeze({
        controls: ["negate", "delete", "clear"],
        operators: ["+", "-", "*", "/", "^"],
        operands: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        parens: ["(", ")"],
        decimal: ["."],
        equals: ["="],
    });
    // === CALCULATOR: control flow ===
    const { and, or } = conditionals;
    const logic = {
        controls: function (text, key) {
            switch (key) {
                case "clear":
                    output.textContent = constants.DEFAULT_ZERO;
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
                        output.textContent = constants.DEFAULT_ZERO;
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
                    key === ")",
                    or(
                        regex.is_trailing_operator(text),
                        regex.is_open_paren(text)
                    )
                )
            ) {
                return;
            } else if (and(key === "(", regex.is_default_zero(text))) {
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
                output.textContent = constants.ZERO_ERROR;
                return;
            } else {
                const parsed = compute.parse(
                    compute.tokenize(utils.insert_imp(text))
                );
                if (parsed === null) {
                    output.textContent = constants.PAREN_ERROR;
                    return;
                } else {
                    const result = compute.evaluate(parsed);
                    if (utils.unsafe_number(result)) {
                        output.textContent = constants.OVERFLOW_ERROR;
                        return;
                    } else {
                        output.textContent = String(result);
                    }
                }
            }
        },
    };
    // === CALCULATOR: components ===
    const calculator = document.querySelector("[data-calculator]");
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
})();
