Consider a family of binary rows built step by step. The first row holds a
single `0`. To form each later row, every symbol of the previous row is
expanded: each `0` turns into the pair `01` and each `1` turns into the pair
`10`. So the rows grow as `0`, then `01`, then `0110`, then `01101001`,
and so on, with row `n` holding `2^(n-1)` entries.

You are given a row index `n` (counting from 1) and a position `k`
(counting from 1 inside that row). Report the symbol that appears at that
spot.

**Constraints:**
- `1 <= n <= 30`
- `1 <= k <= 2^(n-1)`
