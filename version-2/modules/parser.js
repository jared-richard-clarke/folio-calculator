import constants from "./constants.js";
import scan from "./lexer.js";
import tools from "./tools.js";

// parser(string) -> [string, null] | [null, [token]]
//     where token = { type, value, message, column, length }
//
// Scans, parses, and evaluates a string as an arithmetic expression.
// Function does not build an abstract syntax tree. Instead it evaluates the expression as it parses.
// Returns a two part array — "[string, null]" if successful, "[null, [token]]" if unsuccessful.
// "string" is an evaluated arithmetic expression, and "[token]" is an array of error tokens
// both locating and describing errors within the input string.
const parser = (function () {
    // === parser: state ===
    // Tracks the parser's internal state.
    const state = (function () {
        const tokens = {
            source: [],
            length: 0,
            index: 0,
            end: 0,
        };
        // > state.set(string)
        //   Resets the parser with its new input.
        function set(source) {
            tokens.source = source;
            tokens.length = source.length;
            tokens.index = 0;
            tokens.end = source.length - 1;
        }
        // > state.next() -> token
        //   Moves the parser to the next token within the source array.
        //   Returns the previous token.
        function next() {
            if (tokens.index >= tokens.end) {
                return tokens.source[tokens.end];
            }
            const token = tokens.source[tokens.index];
            tokens.index += 1;
            return token;
        }
        // > state.peek() -> token.type
        //   Returns the type of the next token without consuming the token.
        function peek() {
            return tokens.source[tokens.index].type;
        }
        // > state.match(string) -> boolean
        //   Checks if the proceeding token type matches the expected token type.
        function match(expect) {
            return peek() === expect;
        }
        // > state.consumed() -> boolean
        //   Checks if the parser has consumed all its input.
        function consumed() {
            return tokens.index >= tokens.end;
        }
        // > state.length() -> number
        //   Returns the length of the internal token array.
        function length() {
            return tokens.length;
        }
        // > state.flush(token) -> [token] where token.type = "error"
        //   Collects all the error tokens into a single array and
        //   returns it to the caller.
        function flush(error) {
            const errors = [error];
            while (tokens.index < tokens.end) {
                const token = next();
                if (token.type === "error") {
                    errors.push(token);
                }
            }
            return errors;
        }

        return constants.freeze({
            set,
            next,
            peek,
            match,
            consumed,
            length,
            flush,
        });
    })();

    // === parser: parse_expression ===
    //
    // Top down operator precedence parsing, as imagined by Vaughan Pratt,
    // combines lexical semantics with functions. Each lexeme is assigned a
    // function — its semantic code. To parse a string of lexemes is to execute
    // the semantic code of each lexeme in turn from left to right.
    //
    // There are two types of semantic code:
    // 1. nud: a lexeme function without a left expression.
    // 2. led: a lexeme function with a left expression.
    //
    // This semantic code forms the parsers internal to "parse".

    // The engine of Pratt's technique, "parse_expression" drives the parser,
    // calling the semantic code of each lexeme in turn from left to right.
    // For every level of precedence — dictated by position and binding power —
    // there is a call to "parse_expression" either through the "nud" or "led" parser
    // of the associated lexeme. The resolution of "parse_expression" is to return
    // either an evaluated expression or an error token.
    function parse_expression(rbp) {
        const token = state.next();
        const [nud, ok] = table.get_parser(token.type, "nud");
        if (!ok) {
            token.message += constants.NOT_PREFIX;
            return [null, token];
        }
        let [x, error] = nud(token);
        if (error !== null) {
            return [null, error];
        }
        while (rbp < table.get_binding(state.peek())) {
            const token = state.next();
            const [led, ok] = table.get_parser(token.type, "led");
            if (!ok) {
                token.message += constants.NOT_INFIX;
                return [null, token];
            }
            [x, error] = led(x, token);
            if (error !== null) {
                return [null, error];
            }
        }
        return [x, null];
    }
    // > parse_eof(token) -> [null, token]
    //   The "eof" token marks the end of a token array. Calling code
    //   on this token means an error. "parse_eof" resolves these errors.
    function parse_eof(token) {
        if (state.length() === 1) {
            // If the expression is empty, then the error spans it.
            token.length = token.column;
            token.column = 0;
            token.message += constants.EMPTY_EXPRESSION;
            return [null, token];
        }
        token.message += constants.INCOMPLETE_EXPRESSION;
        return [null, token];
    }
    // > parse_closed_paren(token) -> [null, token]
    //   Calling the associated function on a closing parenthesis
    //   means the parenthesis hasn't been consumed by a grouping expression,
    //   meaning its a mismatched parenthesis.
    function parse_closed_paren(token) {
        token.message += constants.MISMATCHED_PAREN;
        return [null, token];
    }
    // > parse_number(token) -> [null, token] | [number, null]
    //   Parses number expressions.
    function parse_number(token) {
        const number = Number.parseFloat(token.value);
        if (Number.isNaN(number)) {
            token.message += constants.NOT_NUMBER;
            return [null, token];
        }
        if (!Number.isFinite(number)) {
            token.message += constants.NUMBER_RANGE;
            return [null, token];
        }
        return [number, null];
    }
    // > parse_unary(token) -> [null, token] | [value, null]
    //   Parses unary expressions. Parses expression, and, if successful,
    //   calls the associated unary operation on that expression.
    function parse_unary(token) {
        const bind = table.get_binding(token.type);
        const [x, error] = parse_expression(bind);
        if (error !== null) {
            return [null, error];
        }
        const operation = tools.unary_operation[token.type];
        const value = operation(x);
        if (typeof value === "string") {
            token.message += value;
            return [null, token];
        }
        if (!Number.isFinite(value)) {
            token.message += constants.OPERATION_RANGE;
            return [null, token];
        }
        return [value, null];
    }
    // > parse_binary(boolean) -> function(value, token) -> [null, token] | [value, null]
    //   Constructs binary-expression parsers, which take a left expression
    //   and parse a right expression, and, if successful, call the associated
    //   binary operation on both the right and left expressions.
    function parse_binary(left) {
        return function (x, token) {
            const bind = table.get_binding(token.type);
            const [y, error] = parse_expression(left ? bind : bind - 1);
            if (error !== null) {
                return [null, error];
            }
            const operation = tools.binary_operation[token.type];
            const value = operation(x, y);
            if (typeof value === "string") {
                token.message += value;
                return [null, token];
            }
            if (!Number.isFinite(value)) {
                token.message += constants.OPERATION_RANGE;
                return [null, token];
            }
            return [value, null];
        };
    }
    // > parse_left(value, token) -> [null, token] | [value, null]
    //   Parses binary expressions that associate left.
    const parse_left = parse_binary(true);
    // > parse_right(value, token) -> [null, token] | [value, null]
    //   Parses binary expressions that associate right.
    const parse_right = parse_binary(false);
    // > parse_postfix(value, token) -> [null, token] | [value, null]
    //   Parses postfix expressions. Takes a left expression,
    //   evaluates it, then applies an unary operator to its result.
    function parse_postfix(x, token) {
        const operation = tools.unary_operation[token.type];
        const value = operation(x);
        if (typeof value === "string") {
            token.message += value;
            return [null, token];
        }
        if (!Number.isFinite(value)) {
            token.message += constants.OPERATION_RANGE;
            return [null, token];
        }
        return [value, null];
    }
    // > parse_grouping(token) -> [null, token] | [value, null]
    //   Parses expressions grouped within parentheses. If an expression is parsed successfully,
    //   following an open parenthesis, "parse_grouping" checks for a matching closed parenthesis.
    function parse_grouping(token) {
        // Check for empty parenthetical grouping.
        if (state.match(constants.CLOSE_PAREN)) {
            token.message += constants.EMPTY_PARENS;
            return [null, token];
        }
        const [x, error] = parse_expression(0);
        if (error !== null) {
            return [null, error];
        }
        if (!state.match(constants.CLOSE_PAREN)) {
            token.message += constants.MISMATCHED_PAREN;
            return [null, token];
        }
        // Consume the closing parenthesis.
        state.next();
        return [x, null];
    }
    // === parser: table ===
    // Maps all the parsers and bindings to their associated lexemes.
    const table = (function () {
        // === table: registry ===
        const registry = Object.create(null);
        // Helper function maps the parsers and bindings to their associated lexemes
        // within the lookup table's internal registry.
        function register(bind, lexemes, { nud, led }) {
            lexemes.forEach((lexeme) => {
                registry[lexeme] = {
                    bind,
                    nud,
                    led,
                };
            });
        }
        register(0, [constants.ERROR], {
            nud: null,
            led: null,
        });
        register(0, [constants.EOF], {
            nud: parse_eof,
            led: null,
        });
        register(0, [constants.NUMBER], {
            nud: parse_number,
            led: null,
        });
        register(0, [constants.OPEN_PAREN], {
            nud: parse_grouping,
            led: null,
        });
        register(0, [constants.CLOSE_PAREN], {
            nud: parse_closed_paren,
            led: null,
        });
        register(0, [constants.SQUARE_ROOT], {
            nud: parse_unary,
            led: null,
        });
        register(
            10,
            [constants.ADD, constants.SUBTRACT, constants.SUBTRACT_ALT],
            {
                nud: parse_unary,
                led: parse_left,
            }
        );
        register(
            20,
            [
                constants.MULTIPLY,
                constants.MULTIPLY_ALT,
                constants.DIVIDE,
                constants.DIVIDE_ALT,
            ],
            { nud: null, led: parse_left }
        );
        register(30, [constants.IMPLIED_MULTIPLY], {
            nud: null,
            led: parse_left,
        });
        register(40, [constants.EXPONENT], {
            nud: null,
            led: parse_right,
        });
        register(50, [constants.PERCENTAGE, constants.FACTORIAL], {
            nud: null,
            led: parse_postfix,
        });
        // > table.get_parser(string) -> [parser, true] | [null, false]
        //   If the parser exists for the associated lexeme, returns the
        //   parser alongside boolean true. Otherwise returns null alongside
        //   boolean false.
        function get_parser(lexeme, type) {
            const parser = registry[lexeme][type];
            return parser === null || parser === undefined
                ? [null, false]
                : [parser, true];
        }
        // > table.get_binding(string) -> number
        //   Returns the binding power of the associated lexeme.
        //   If, for whatever reason, the lexeme has no binding power, the function
        //   will return 0 as a default.
        function get_binding(lexeme) {
            const binding = registry[lexeme].bind;
            return binding === undefined ? 0 : binding;
        }
        return constants.freeze({
            get_parser,
            get_binding,
        });
    })();
    return function (text) {
        // Transform text into tokens. Set parser's internal state.
        const tokens = scan(text);
        state.set(tokens);
        // Parse expression.
        const [x, error] = parse_expression(0);
        if (error !== null) {
            const errors = state.flush(error);
            return [null, errors];
        }
        // Check for unused tokens.
        if (!state.consumed()) {
            const token = state.next();
            if (token.type === constants.NUMBER) {
                token.message += constants.MISPLACED_NUMBER;
            }
            if (token.type === constants.CLOSE_PAREN) {
                token.message += constants.MISMATCHED_PAREN;
            }
            if (tools.is_operator(token.type)) {
                token.message += constants.MISPLACED_OPERATOR;
            }
            const errors = state.flush(token);
            return [null, errors];
        }
        return [x, null];
    };
})();

// > parse(string) -> [string, null] | [null, string]
//   where string = arithmetic expression
//
// Parses string as an arithmetic expression, formats the result, and returns it in a two-part array.
// If successful, the first value is the formatted result, and the second value is null.
// If unsuccessful, the first value is null, and the second value is the formatted error.
export default function parse(text) {
    const [success, errors] = parser(text);
    if (success !== null) {
        return [String(success), null];
    }

    const space = constants.WHITE_SPACE;
    const linefeed = constants.LINEFEED;
    const period = "." + space;
    const caret = "^";
    const expression = text.replace(/\s/g, space) + linefeed;

    const locators =
        errors
            .map((error, index, array) => {
                let offset = 0;
                const column = error.column;
                if (index > 0) {
                    const prev = array[index - 1];
                    offset = prev.column + prev.length;
                }
                return space.repeat(column - offset) + caret;
            })
            .join("") + linefeed;

    const messages =
        errors
            .map((error, index) => {
                const count = String(index + 1) + period;
                return count + error.message;
            })
            .join("") + linefeed;
    return [null, expression + locators + messages];
}
