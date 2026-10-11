You get a string equation with exactly one `=` sign, for example `"x+5-3+x=6+x-2"`. Each side is a sum of integer constants and `x` terms such as `"2x"`, `"-x"`, or `"x"`. There are no parentheses and no powers.

Solve for `x` and implement `solveEquation(equation)`:

- If exactly one integer solution exists, return `"x=<value>"`, e.g. `"x=2"`.
- If every integer satisfies the equation, return `"Infinite solutions"`.
- If no value satisfies it, return `"No solution"`.

**Constraints:**
- `3 <= equation.length <= 1000`
- The equation holds digits, `x`, `+`, `-`, and exactly one `=`.
- Every term is valid; a bare `x` means coefficient 1 and `-x` means -1.
- If a unique solution exists, it fits in a 32-bit signed integer.
