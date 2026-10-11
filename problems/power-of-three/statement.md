Given an integer `n`, decide whether it can be written as `3` raised to some non-negative integer power (`1, 3, 9, 27, ...`). Return `true` when such an exponent exists and `false` otherwise.

**Example 1:**
```
Input: n = 27
Output: true
Explanation: 27 equals 3 multiplied by itself 3 times.
```

**Example 2:**
```
Input: n = 0
Output: false
Explanation: No power of 3 equals 0.
```

**Example 3:**
```
Input: n = -1
Output: false
Explanation: Powers of 3 are positive, so -1 is impossible.
```

**Constraints:**
- `-2^31 <= n <= 2^31 - 1`
