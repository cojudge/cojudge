Write the integers `1` through `n` in a row. Then repeatedly thin the row as follows: first sweep from left to right, deleting the first remaining value and then every second value after it; next sweep from right to left, deleting the last remaining value and then every second value before it. Keep alternating the sweep direction until a single value survives, and report it.

**Constraints:**
- `1 <= n <= 10^9`

Simulating the deletions directly is far too slow for large `n`; track how the leading survivor and the step size evolve instead.
