Given counts `a` and `b`, build a string containing exactly `a` copies of `a` and `b` copies of `b` such that neither `aaa` nor `bbb` appears as a contiguous block.

All test inputs satisfy the feasibility condition `max(a, b) <= 2 * (min(a, b) + 1)`, so at least one valid arrangement exists. Any valid arrangement is accepted.

**Constraints:**
- `0 <= a, b <= 100`
- `a + b > 0`
- Inputs guarantee a valid string exists.
