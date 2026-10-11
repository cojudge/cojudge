Given a non-negative integer `num`, repeatedly replace it by the sum of its decimal digits until only one digit remains. Return that final digit.

**Example 1:**
```
Input: num = 38
Output: 2
Explanation: 3 + 8 = 11, then 1 + 1 = 2.
```

**Example 2:**
```
Input: num = 0
Output: 0
Explanation: 0 already has one digit.
```

**Example 3:**
```
Input: num = 123
Output: 6
Explanation: 1 + 2 + 3 = 6, which is a single digit.
```

**Constraints:**
- `0 <= num <= 2^31 - 1`
