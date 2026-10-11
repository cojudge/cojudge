Count all integers `x` with `0 <= x < 10^n` whose decimal digits are pairwise
different. Note that `0` itself counts as a one-digit number with unique
digits.

For `n = 2` the range is `0..99`, and only the nine doubles `11, 22, ..., 99`
are excluded, giving `91`. For `n = 0` the range holds just `0`, giving `1`.

**Example 1:**
```
Input: n = 2
Output: 91
Explanation: All numbers from 0 to 99 except 11, 22, 33, 44, 55, 66, 77, 88
and 99 have distinct digits.
```

**Example 2:**
```
Input: n = 0
Output: 1
```

**Example 3:**
```
Input: n = 1
Output: 10
```

**Constraints:**
- `0 <= n <= 8`
