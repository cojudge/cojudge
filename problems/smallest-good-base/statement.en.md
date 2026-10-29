An integer `n` (given as its decimal text) has a *good base* `k >= 2` when writing `n` in base `k` uses only the digit `1` — that is, `n = 1 + k + k^2 + ... + k^m` for some length `m >= 1`. Every `n >= 3` has at least the trivial base `n - 1` (form `11`).

Return the smallest such base, again as decimal text.

**Constraints:**

- `n` is an integer in `[3, 10^18]` with no leading zeroes.
