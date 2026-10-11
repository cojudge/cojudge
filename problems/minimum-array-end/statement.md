Two integers `n` and `x` are supplied. Consider positive-integer arrays `nums` of length `n` that climb strictly at each position, so `nums[i + 1]` is always larger than `nums[i]` for `0 <= i < n - 1`, and whose cumulative bitwise AND across all positions equals `x`.

Among every array meeting those two requirements, make the final entry `nums[n - 1]` as small as possible, and output that smallest achievable final value.

**Examples:**

```
Input: n = 3, x = 4
Output: 6
Explanation: One feasible choice is [4, 5, 6], because 4 AND 5 AND 6 is 4 and the entries rise strictly. No feasible array ends below 6, so 6 is the answer for nums[2].
```

```
Input: n = 2, x = 7
Output: 15
Explanation: One feasible choice is [7, 15], because 7 AND 15 is 7 and the entries rise strictly. No feasible array ends below 15, so 15 is the answer for nums[1].
```

**Constraints:**

- `1 <= n, x <= 10^8`
