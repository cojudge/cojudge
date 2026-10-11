A positive integer counts as magical when it is divisible by `a` or by `b`. Given `n`, `a` and `b`, return the `n`-th magical number. Because the answer can be huge, return it modulo `10^9 + 7`.

**Example 1:**
```
Input: n = 1, a = 2, b = 3
Output: 2
Explanation: The magical numbers start 2, 3, 4, 6, 8, ..., so the first one is 2.
```

**Example 2:**
```
Input: n = 4, a = 2, b = 3
Output: 6
Explanation: Listing them in order gives 2, 3, 4, 6, so the fourth is 6.
```

**Example 3:**
```
Input: n = 5, a = 2, b = 4
Output: 10
Explanation: Every even number is magical here, so the fifth one is 10.
```

**Constraints:**
- `1 <= n <= 10^9`
- `2 <= a, b <= 4 * 10^4`
