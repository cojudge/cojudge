You are given a string `s` that contains only the characters `(` and `)`. The string is balanced, meaning every opening bracket is eventually closed in the correct order.

A score is assigned to such strings using the following ideas, applied in your own reasoning:

- The smallest balanced pair `()` is worth one point.
- When two balanced blocks sit side by side, their values add up.
- When one balanced block is wrapped inside an extra pair of brackets, its value doubles.

Compute the total score of `s`.

**Constraints:**
- `1 <= s.length <= 50`
- `s` holds only `(` and `)` and forms a balanced sequence.
- `s.length` is even.
