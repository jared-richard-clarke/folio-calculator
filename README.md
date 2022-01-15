# Calculator

## Tools:
- Shunting Yard Algorithm
- Regular Expressions
- Document Object Model (DOM)

## Project:
December 2020, I resolved to teach myself how to program. This calculator—which I built with HTML, CSS, and JavaScript—is the culmination of careful study.

I built my calculator on three modules: `compute`, `regex`, and `utils`. Module `compute` is a rudimentary tokenizer, parser, and evaluator. It uses the *Shunting Yard Algorithm* to convert infix to postfix notation for simple evaluation via a stack. Module `regex` monitors user input through regular expressions, preventing most invalid character combinations from being input for evaluation. Module `utils` is a collection of utility functions that supplement the other modules.

I use these modules to manipulate my calculator input and output via an event listener. This event listener delegates for the entire calculator widget, choosing different module functionality based on user input. Most computation occurs in JavaScript. Only the `<output>` element is mutated via the `Node.textContent` property.

## Modules
### compute
Provides functions that tokenize, parse, and evaluate arithmetic expressions.
1. **tokenize**
   - `tokenize(string)` -> `[string, number]`
   - Break string into array of operators(strings) and operands(numbers).
   - `tokenize("1 + 1")` -> `[ 1, "+", 1 ]`
2. **parse**
   - `parse([string, number])` -> `[string, number]` or `null` if mismatched parentheses
   - Transform infix to postfix. Return `null` for mismatched parenthesis.
   - `parse([ 1, "+", 1 ])` -> `[ 1, 1, "+" ]` or `parse([ "(", 1, "+", 1 ])` -> `null`
3. **evaluate**
   - `evaluate([string, number])` -> `number`
   - Process postfix. Return sum.
   - `evaluate([ 1, 1, "+" ])` -> `2`

### utils
Provides utility functions for string and number manipulation.
1. **negate_num_char**
   - `negate_num_char(string)` -> `string`
   - Flip sign of numerical string.
   - `negate_num_char("-1")` -> `"1"` or `negate_num_char("1")` -> `"-1"`
2. **unsafe_number**
   - `unsafe_number(number)` -> `boolean`
   - Determines whether number is within JavaScript's safe numerical range.
   - `unsafe_number(Number.MAX_SAFE_INTEGER + 1)` -> `true`
3. **pad**
   - `pad(string)` -> `string`
   - Add whitespace character to start and end of string.
   - `pad("+")` -> `" + "`
4. **insert_imp**
   - `insert_imp(string)` -> `string`
   - Insert implied multiplication symbol into arithmetic expression prior to evaluation.
   - `insert_imp("2 ( 2 )")` -> `"2 imp-× ( 2 )"`
5. **replace_end**
   - `replace_end(string, string)` -> `string`
   - Replaces `0` with one of either `1` through `9` if `0` follows operator. Prevents malformed expressions like `1 ÷ 05`.
   - `replace_end("1 ÷ 0", "5")` -> `"1 ÷ 5"`
6. **delete_char**
   - `delete_char(string)` -> `string`
   - Deletes character at end of string.
   - `delete_char("1 + 1")` -> `"1 + "`

### regex
Provides regular-expressions for examining calculator input.
1. **is_trailing_operator**
   - `is_trailing_operator(string)` -> `boolean`
   - Is there a trailing operator?
   - `is_trailing_operator("1 + ")` -> `true`
2. **is_open_paren**
   - `is_open_paren(string)` -> `boolean`
   - Is their an open parenthesis at end of string?
   - `is_open_paren("1 + 1 ( ")` -> `true`
3. **is_default_zero**
   - `is_default_zero(string)` -> `boolean`
   - Is the expression `"0"`?
   - `is_default_zero("0")` -> `true`
4. **is_trailing_zero**
   - `is_trailing_zero(string)` -> `boolean`
   - Is `0` at end of string?
   - `is_trailing_zero("1 + 0")` -> `true`
5. **is_decimal**
   - `is_decimal(string)` -> `boolean`
   - Does number have decimal point?
   - `is_decimal("1.5")` -> `true`
6. **is_trailing_decimal**
   - `is_trailing_decimal(string)` -> `boolean`
   - Does expression have a trailing decimal point?
   - `is_trailing_decimal("1.")` -> `true`
7. **is_trailing_digit**
   - `is_trailing_digit(string)` -> `boolean`
   - Does expression end with number?
   - `is_trailing_digit("1 + 1")` -> `true`
8. **is_divide_by_zero**
   - `is_divide_by_zero(string)` -> `boolean`
   - Does expression have divide-by-zero errors?
   - `is_divide_by_zero("1 ÷ 0")` -> `true`
9. **is_paren_error**
   - `is_paren_error(string)` -> `boolean`
   - Is expression `PAREN_ERROR`?
   - `is_paren_error(PAREN_ERROR)` -> `true`
10. **is_zero_error**
   - `is_zero_error(string)` -> `boolean`
   - Is expression `ZERO_ERROR`?
   - `is_zero_error(ZERO_ERROR)` -> `true`
11. **is_overflow_error**
   - `is_overflow_error(string)` -> `boolean`
   - Is expression `OVERFLOW_ERROR`?
   - `is_overflow_error(OVERFLOW_ERROR)` -> `true`
12. **is_single_char**
   - `is_single_char(string)` -> `boolean`
   - Is expression single character?
   - `is_single_char("1")` -> `true`

### conditionals
Provides functional replacements for `&&` and `||` operators..
1. **and**
   - `and(...expressions)` -> `boolean`
   - If any expression evaluates `false`, stop evaluation and return `false`.
   - `and(1 < 2, 3 === 3)` -> `true`
2. **or**
   - `or(...expressions)` -> `boolean`
   - If any expression evaluates `true`, stop evaluation and return `true`.
   - `or(1 < 2, 3 !== 3)` -> `true`

### logic
Delegates functionality based on user input.
1. **controls**
   - `controls(string, string)` -> `void`
   - Delegates for control events: clear, delete, negate.
2. **operators**
   - `operators(string, string)` -> `void`
   - Delegates for operator events: `+`, `-`, `*`, `/`, `**`.
3. **operands**
   - `operands(string, string)` -> `void`
   - Delegates for operand events: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.
4. **parens**
   - `parens(string, string)` -> `void`
   - Delegates for paren events: `(`, `)`.
5. **decimal**
   - `decimal(string, string)` -> `void`
   - Delegates for decimal event: ` . `.
6. **equals**
   - `equals(string, string)` -> `void`
   - Delegates for equals event: ` = `.
