Given a non-negative integer `n`, count how many trailing zeros appear in `n!` (n factorial).

Trailing zeros come from factors of 10, and there are always more factors of 2 than of 5, so the answer is the number of factors of 5 inside `1 * 2 * ... * n`.

**Example 1:**
```
Input: n = 3
Output: 0
Explanation: 3! is 6, which has no trailing zero.
```

**Example 2:**
```
Input: n = 5
Output: 1
Explanation: 5! is 120, which ends with one zero.
```

**Example 3:**
```
Input: n = 0
Output: 0
Explanation: 0! is 1, which has no trailing zero.
```

**Constraints:**
- `0 <= n <= 10^4`
