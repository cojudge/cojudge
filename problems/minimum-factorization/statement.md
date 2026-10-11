You are given a positive integer `a`. Write it as a product of integers each between 2 and 9 inclusive, then concatenate those factors as decimal digits to form a new integer. Among all such splittings, return the smallest achievable integer.

Handle the edges directly: values below 10 are already answers. When no splitting into allowed digits exists, return 0. Answers exceeding the 32-bit signed ceiling also yield 0.

**Example 1:**
```
Input: a = 48
Output: 68
Explanation: 48 = 6 * 8, and 68 is smaller than 86.
```

**Example 2:**
```
Input: a = 15
Output: 35
```

**Example 3:**
```
Input: a = 13
Output: 0
```

**Constraints:**
- `1 <= a <= 2^31 - 1`
