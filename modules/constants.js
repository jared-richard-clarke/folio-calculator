// operator symbols
const ADD = "+";
const SUB = "-";
// ----------------
const MUL = "×";
const IMP = "imp-×";
const LML = "*";
// ----------------
const DIV = "÷";
const LDV = "/";
// ----------------
const EXP = "^";
// ----------------
const OPE = "(";
const CLO = ")";
// ----------------
const OPERATORS = SUB + ADD + MUL + DIV + EXP;
// base number
const DEFAULT_ZERO = "0";
// error messages
const PAREN_ERROR = "Mismatched parentheses.";
const ZERO_ERROR = "Cannot divide by zero.";
const OVERFLOW_ERROR = "Number outside safe range.";
// key maps
function pad(text) {
    return " " + text + " ";
}
const OPERATOR_MAP = Object.freeze({
    [ADD]: pad(ADD),
    [SUB]: pad(SUB),
    [LML]: pad(MUL),
    [LDV]: pad(DIV),
    [EXP]: pad(EXP),
});
const PAREN_MAP = Object.freeze({
    [OPE]: pad(OPE),
    [CLO]: pad(CLO),
});
// Added lookup table to avoid endless conditionals.
const LOOKUP = Object.freeze({
    controls: ["negate", "delete", "clear"],
    operators: [ADD, SUB, LML, LDV, EXP],
    operands: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    parens: [OPE, CLO],
    decimal: ["."],
    equals: ["="],
});

export default Object.freeze({
    ADD,
    SUB,
    MUL,
    IMP,
    LML,
    DIV,
    LDV,
    EXP,
    OPE,
    CLO,
    OPERATORS,
    DEFAULT_ZERO,
    PAREN_ERROR,
    ZERO_ERROR,
    OVERFLOW_ERROR,
    OPERATOR_MAP,
    PAREN_MAP,
    LOOKUP,
});
