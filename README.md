# Portfolio Calculator

## Tools:
- Pratt Parser
- Document Object Model (DOM)

## Project:

December 2021, I resolved to teach myself how to program. This calculator — which I built with
plain HTML, CSS, and JavaScript — was the culmination of careful study. September 2023, I rewrote
this application to better reflect my improving skillset.

Both calculators are built on top of expression parsers. My first parser is rudimentary — easily
misled by unexpected character combinations and misplaced whitespace. Anticipating malformed user
input is complex. I had shifted much of this complexity over to a tangle of regular expressions,
which are cryptic and hard to debug. These too would fail.

My new calculator's core is a **top-down operator precedence** parser modeled on ideas pioneered by the
computer scientist **Vaughan R. Pratt**. A full-featured parser, it handles infix and prefix notation,
left and right associativity, nested and mismatched parenthetical groupings, multiple levels of precedence
and all types of whitespace. Errors are made explicit through robust error handling and a formatted
user interface. 

I also implemented a version of my calculator's core parser with a complementary big-number library.
Its high precision calculations proved too computationally expensive and its output size too unwieldy
for my calculator UI. This also can be found on [Github](https://github.com/jared-richard-clarke/pratt-parser). 
