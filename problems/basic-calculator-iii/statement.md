Implement a calculator for the string `s`, which holds non-negative integers, the four operators `+`, `-`, `*`, `/`, parentheses `(` `)`, and spaces. Division between integers discards any fractional part toward zero (for example `5 / 2` is `2` and `-5 / 2` is `-2`).

Evaluate using the standard order: innermost parentheses first, then multiplication and division left to right, then addition and subtraction left to right. A leading minus or a minus right after `(` acts as a unary negation.

Return the integer result. This is a portable string adaptation: the formula travels as a plain string and the answer is a plain integer.

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` holds only digits, `+`, `-`, `*`, `/`, `(`, `)`, and spaces
- `s` is a valid expression; division by zero never occurs
- Intermediate results fit in a signed 32-bit integer
