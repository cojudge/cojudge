You are given the integer `n`, which stands for the numbers `1` through `n`. A *beautiful arrangement* is a reordering `p` of these numbers (using each exactly once) where every position `i` (counted from 1) satisfies at least one of:
- `p[i]` is divisible by `i`, or
- `i` is divisible by `p[i]`.

Return how many distinct beautiful arrangements exist for the given `n`.

**Constraints:**
- `1 <= n <= 15`
