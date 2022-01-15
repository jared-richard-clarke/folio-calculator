// Module "symbols" provides symbol constants.
// Consolidates variables.
const ADD = "+";
const SUB = "-";
// ----------------
const MUL = "×";     // symbolic multiplier.
const IMP = "imp-×"; // implied multiplier
const LML = "*";     // literal multiplier recognized by JavaScript.
// ----------------
const DIV = "÷";     // symbolic divider.
const LDV = "/";     // literal divider recognized by JavaScript.
// ----------------
const EXP = "^";
// ----------------
const OPE = "(";
const CLO = ")";
// ----------------
const OPERATORS = SUB + ADD + MUL + DIV + EXP; // "-+×÷^"

export { ADD, SUB, MUL, IMP, LML, DIV, LDV, EXP, OPE, CLO, OPERATORS };
