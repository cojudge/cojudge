Given an integer `n`, determine whether it is a power of two.

An integer is a power of two when some non-negative integer `x` satisfies `n == 2^x`. In binary this means exactly one bit is set and the value is positive.

Return `true` when `n` meets that definition, otherwise return `false`.

**Example 1:**
```
Input: n = 1
Output: true
Explanation: 2^0 equals 1.
```

**Example 2:**
```
Input: n = 16
Output: true
Explanation: 2^4 equals 16.
```

**Example 3:**
```
Input: n = 3
Output: false
Explanation: No integer power of two equals 3.
```

**Constraints:**
- `-2^31 <= n <= 2^31 - 1`
