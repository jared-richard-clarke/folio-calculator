import constants from "./constants.js";
import tools from "./tools.js";

// scan(string) -> [token]
// where token = { type, value, message, column, length }
//
// A lexer that transforms a string into an array of tokens — objects
// containing lexemes, related descriptions, and positional information.
const scan = (function () {
    // === lexer: state ===
    // Tracks the lexer state within a string.
    const state = (function () {
        const internal = {
            characters: [],
            tokens: [],
            end: 0,
            start: 0,
            current: 0,
        };
        // > state.set(string)
        //   Resets the lexer with new input. Transforms string into
        //   an iterable array of characters. Uses spread syntax to
        //   avoid direct indexing into a UTF-16 encoded string.
        function set(text) {
            const iter = [...text];
            internal.characters = iter;
            internal.tokens = [];
            internal.end = iter.length - 1;
            internal.start = 0;
            internal.current = 0;
        }
        // > state.lexeme() -> string
        //   Returns a lexeme by slicing into the underlying characters array.
        function lexeme() {
            return internal.characters
                .slice(internal.start, internal.current)
                .join("");
        }
        // > state.lexeme_start() -> number
        //   Returns the starting position of the current potential lexeme.
        function lexeme_start() {
            return internal.start;
        }
        // > state.lexeme_length() -> number
        //   Returns the length of the current potential lexeme.
        function lexeme_length() {
            return internal.current - internal.start;
        }
        // > state.end() -> number
        //   Returns the final index of the internal characters array.
        function end() {
            return internal.end;
        }
        // > state.add_token(token)
        //   Appends a new token to the internal tokens array.
        function add_token(type, value, message, column, length) {
            internal.tokens.push({ type, value, message, column, length });
        }
        // > state.consumed() -> boolean
        //   Checks if the lexer has consumed all its input.
        function consumed() {
            return internal.current > internal.end;
        }
        // > state.next() -> character
        //   Moves the lexer to the next character within the characters array.
        //   Returns the character to the caller for potential processing.
        function next() {
            const current = internal.current;
            internal.current += 1;
            return internal.characters[current];
        }
        // > state.reset()
        //   Moves the lexer to the start of the next potential lexeme.
        function reset() {
            internal.start = internal.current;
        }

        // Factory function produces methods that look ahead by a set number
        // of characters into the character array without the lexer consuming them.
        function look_ahead(x) {
            x -= 1;
            return function () {
                const index = internal.current + x;
                if (index > internal.end) {
                    return constants.EOF;
                }
                return internal.characters[index];
            };
        }
        // > state.peek() -> string
        //   Look ahead one character.
        const peek = look_ahead(1);
        // > state.peek_next() -> string
        //   Look ahead two characters.
        const peek_next = look_ahead(2);
        // > state.peek_after_next() -> string
        //   Look ahead three characters.
        const peek_after_next = look_ahead(3);

        // > state.skip_whitespace()
        //   Skips whitespace characters while moving the lexer forward.
        function skip_whitespace() {
            while (tools.is_space(peek())) {
                internal.current += 1;
            }
        }
        // > state.tokens() -> [tokens]
        //   Returns the internal tokens array to the caller.
        function tokens() {
            return internal.tokens;
        }
        return constants.freeze({
            set,
            lexeme,
            lexeme_start,
            lexeme_length,
            end,
            add_token,
            consumed,
            next,
            reset,
            look_ahead,
            peek,
            peek_next,
            peek_after_next,
            skip_whitespace,
            tokens,
        });
    })();

    // > lexer: scan_token()
    //   Consumes a lexeme from the characters array, builds a token object,
    //   and appends it to the tokens array.
    function scan_token() {
        state.reset();
        const char = state.next();
        if (tools.is_space(char)) {
            return;
        } else if (tools.is_operator(char)) {
            state.add_token(char, null, "", state.lexeme_start(), 1);
            return;
        } else if (char === constants.CLOSE_PAREN) {
            state.add_token(char, null, "", state.lexeme_start(), 1);
            // Check for implied multiplication: (7+11)(11+7), or (7+11)7
            state.skip_whitespace();
            const next_char = state.peek();
            if (
                tools.is_digit(next_char) ||
                next_char === constants.OPEN_PAREN
            ) {
                state.add_token(constants.IMPLIED_MULTIPLY, null, "", null, 0);
            }
        } else if (char === constants.OPEN_PAREN) {
            state.add_token(char, null, "", state.lexeme_start(), 1);
        } else if (tools.is_digit(char)) {
            // Check for leading zero error: 07 + 11
            if (char === constants.ZERO && tools.is_digit(state.peek())) {
                state.add_token(
                    constants.ERROR,
                    constants.ZERO,
                    constants.LEADING_ZERO,
                    state.lexeme_start(),
                    1
                );
                return;
            }
            while (tools.is_digit(state.peek())) {
                state.next();
            }
            if (
                state.peek() === constants.DECIMAL_POINT &&
                tools.is_digit(state.peek_next())
            ) {
                state.next();
                while (tools.is_digit(state.peek())) {
                    state.next();
                }
            }
            // Exponential notation: 7e11.
            if (
                tools.is_exponent_suffix(state.peek()) &&
                tools.is_digit(state.peek_next())
            ) {
                state.next();
                while (tools.is_digit(state.peek())) {
                    state.next();
                }
            }
            // Exponential notation: 7e[+-]11.
            if (
                tools.is_exponent_suffix(state.peek()) &&
                tools.is_plus_minus(state.peek_next()) &&
                tools.is_digit(state.peek_after_next())
            ) {
                state.next();
                state.next();
                while (tools.is_digit(state.peek())) {
                    state.next();
                }
            }
            state.add_token(
                constants.NUMBER,
                state.lexeme(),
                "",
                state.lexeme_start(),
                state.lexeme_length()
            );
            // Check for implied multiplication: 7(1 + 2)
            state.skip_whitespace();
            if (state.peek() === constants.OPEN_PAREN) {
                state.add_token(constants.IMPLIED_MULTIPLY, null, "", null, 0);
            }
            return;
        } else if (char === constants.DECIMAL_POINT) {
            // Check for misplaced decimal point.
            state.add_token(
                constants.ERROR,
                constants.DECIMAL_POINT,
                constants.MISPLACED_DECIMAL,
                state.lexeme_start(),
                1
            );
            return;
        } else if (tools.is_ascii_letter(char)) {
            while (tools.is_ascii_letter(state.peek())) {
                state.next();
            }
            const lexeme = state.lexeme();
            // Check for NaN, undefined, or Infinity.
            if (
                lexeme === constants.NAN ||
                lexeme === constants.UNDEFINED ||
                lexeme === constants.INFINITY
            ) {
                state.add_token(
                    constants.ERROR,
                    lexeme,
                    constants.NOT_NUMBER,
                    state.lexeme_start(),
                    state.lexeme_length()
                );
                return;
            }
            // Check for misplaced exponent suffix: "e" or "E".
            if (tools.is_exponent_suffix(lexeme)) {
                state.add_token(
                    constants.ERROR,
                    char,
                    constants.MISPLACED_EXPONENT,
                    state.lexeme_start(),
                    1
                );
                return;
            }
            state.add_token(
                constants.ERROR,
                lexeme,
                constants.UNKNOWN,
                state.lexeme_start(),
                state.lexeme_length()
            );
            return;
        } else {
            state.add_token(
                constants.ERROR,
                char,
                constants.UNKNOWN,
                state.lexeme_start(),
                1
            );
            return;
        }
    }

    // === lexer ===
    return function (text) {
        // Set the internal state of the lexer.
        state.set(text);
        // Run the lexer until all input is consumed.
        while (!state.consumed()) {
            scan_token();
        }
        // Append "eof" token. Flags the end of the input.
        state.add_token(constants.EOF, null, "", state.end() + 1, 0);
        // Return array of tokens.
        return state.tokens();
    };
})();

export default scan;
