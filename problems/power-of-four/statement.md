Given an integer `n`, decide whether it can be written as a power of four — that is, whether some non-negative integer `x` satisfies `n == 4^x` (1, 4, 16, 64, ...).

Return `true` for such values and `false` otherwise. Zero, negatives, and numbers with odd prime factors never qualify.

**Example 1:**
```
Input: n = 16
Output: true
Explanation: 16 equals 4 multiplied by itself twice (4^2).
```

**Example 2:**
```
Input: n = 5
Output: false
Explanation: 5 falls between 4^1 = 4 and 4^2 = 16 with no integer exponent fitting.
```

**Example 3:**
```
Input: n = 1
Output: true
Explanation: Any base to the zeroth power is 1, so 4^0 = 1 qualifies.
```

**Constraints:**
- `-2^31 <= n <= 2^31 - 1`
