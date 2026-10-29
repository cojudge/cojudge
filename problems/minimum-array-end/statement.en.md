Two integers `n` and `x` are supplied. Consider positive-integer arrays `nums` of length `n` that climb strictly at each position, so `nums[i + 1]` is always larger than `nums[i]` for `0 <= i < n - 1`, and whose cumulative bitwise AND across all positions equals `x`.

Among every array meeting those two requirements, make the final entry `nums[n - 1]` as small as possible, and output that smallest achievable final value.

**Constraints:**

- `1 <= n, x <= 10^8`
