You get a string equation with exactly one `=` sign, for example `"x+5-3+x=6+x-2"`. Each side is a sum of integer constants and `x` terms such as `"2x"`, `"-x"`, or `"x"`. There are no parentheses and no powers.

Solve for `x` and implement `solveEquation(equation)`:

- If exactly one integer solution exists, return `"x=<value>"`, e.g. `"x=2"`.
- If every integer satisfies the equation, return `"Infinite solutions"`.
- If no value satisfies it, return `"No solution"`.

**Example 1:**
```
Input: equation = "x+5-3+x=6+x-2"
Output: "x=2"
Explanation: The left side groups to 2x+2 and the right side to x+4, so x = 2.
```

**Example 2:**
```
Input: equation = "x=x"
Output: "Infinite solutions"
```

**Example 3:**
```
Input: equation = "2x=x"
Output: "x=0"
```

**Example 4:**
```
Input: equation = "x=x+1"
Output: "No solution"
```

**Constraints:**
- `3 <= equation.length <= 1000`
- The equation holds digits, `x`, `+`, `-`, and exactly one `=`.
- Every term is valid; a bare `x` means coefficient 1 and `-x` means -1.
- If a unique solution exists, it fits in a 32-bit signed integer.
