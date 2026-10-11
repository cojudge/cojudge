Given a positive integer `n`, look at its binary writing without leading zeros. Decide whether every pair of neighbouring bits differs (the pattern must alternate between `0` and `1`).

Return `true` for alternating numbers and `false` otherwise.

**Example 1:**
```
Input: n = 5
Output: true
Explanation: 5 is 101, and each neighbour differs.
```

**Example 2:**
```
Input: n = 7
Output: false
Explanation: 7 is 111, with equal neighbours.
```

**Example 3:**
```
Input: n = 10
Output: true
Explanation: 10 is 1010, fully alternating.
```

**Constraints:**
- `1 <= n <= 2^31 - 1`
