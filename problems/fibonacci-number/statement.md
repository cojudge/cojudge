The Fibonacci progression starts with 0 and 1, and every later term is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, and so on. Formally, F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n above 1.

Given `n`, return F(n).

**Example 1:**
```
Input: n = 2
Output: 1
Explanation: F(2) = F(1) + F(0) = 1 + 0.
```

**Example 2:**
```
Input: n = 3
Output: 2
Explanation: F(3) = F(2) + F(1) = 1 + 1.
```

**Example 3:**
```
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1.
```

**Constraints:**
- `0 <= n <= 30`
