A positive integer `n` can be written as a sum of one or more consecutive positive integers in several ways (for example, `5 = 5 = 2 + 3`). Count how many such writings exist, where the single-term writing `n = n` always counts.

**Example 1:**
```
Input: n = 5
Output: 2
Explanation: The two writings are 5 alone and 2 + 3.
```

**Example 2:**
```
Input: n = 9
Output: 3
Explanation: The writings are 9 alone, 4 + 5, and 2 + 3 + 4.
```

**Example 3:**
```
Input: n = 15
Output: 4
Explanation: The writings are 15 alone, 7 + 8, 4 + 5 + 6, and 1 + 2 + 3 + 4 + 5.
```

**Constraints:**
- `1 <= n <= 10^9`
