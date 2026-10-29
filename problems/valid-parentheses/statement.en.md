You receive a string `s` assembled only from the six symbols `(`, `)`, `{`, `}`, `[` and `]`. Call the arrangement correctly nested when each closing symbol pairs with a previously seen unmatched opener of the identical shape, pairs finish in the reverse of the order in which they were opened, and no opener is left waiting at the end. Return `true` for correctly nested inputs and `false` otherwise.

**Constraints:**

- 1 ≤ s.length ≤ 10^4
- s consists of parentheses only '()[]{}'.
