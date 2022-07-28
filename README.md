# Calculator

## Tools:
- Shunting Yard Algorithm
- Regular Expressions
- Document Object Model (DOM)

## Project:
December 2020, I resolved to teach myself how to program. This calculator is the culmination of careful study.

My calculator is comprised of three core modules: `compute`, `regex`, and `delegate`. Module `compute` provides a rudimentary tokenizer, parser, and evaluator. it uses the *Shunting Yard Algorithm* to convert infix to postfix notation for simple evaluation via a stack.

Module `regex` provides regular expressions for monitoring textual input. By intercepting as many invalid character combinations as possible, I am able to keep my tokenizer and parser simple. I am also able to streamline my user experience by avoiding cascades of errors.

Finally, module `delegate` provides logic for responding to user events. A single event listener signals for the entire calculator widget. Module `delegate` chooses different functionality based on the type of element clicked and the current expression as parsed by module `regex`.

Most computation occurs outside the DOM. Only the calculator’s `<output>` element is mutated via the `Node.textContent` property. This is also controlled by module `delegate`.

## GitHub vs Portfolio Calculator
There are some key differences between this calculator(**git-calc**) and my portfolio calculator(**folio-calc**):
1. **git-calc** uses ESM modules to help with readability. **folio-calc** consolidates all JavaScript within a single file to both maintain compatibility with older browsers and reduce HTTP requests.
2. **folio-calc** inherits CSS declarations and properties only present in my portfolio. **git-calc** uses a handful of properties — width, padding, font-size — to compensate.
