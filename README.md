# Calculator

## Tools:
- Shunting Yard Algorithm
- Regular Expressions
- Document Object Model (DOM)

## Project:
December 2020, I resolved to teach myself how to program. This calculator—which I built with HTML, CSS, and JavaScript—is the culmination of careful study.

I built my calculator on three modules: `compute`, `regex`, and `utils`. Module `compute` is a rudimentary tokenizer, parser, and evaluator. It uses the *Shunting Yard Algorithm* to convert infix to postfix notation for simple evaluation via a stack. Module `regex` monitors user input through regular expressions, preventing most invalid character combinations from being input for evaluation. Module `utils` is a collection of utility functions that supplement the other modules.

I use these modules to manipulate my calculator input and output via an event listener. This event listener delegates for the entire calculator widget, choosing different module functionality based on user input. Most computation occurs in JavaScript. Only the `<output>` element is mutated via the `Node.textContent` property.
