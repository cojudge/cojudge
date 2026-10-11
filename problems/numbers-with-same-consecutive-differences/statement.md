List every non-negative integer with exactly `n` digits (no leading zeros, except that `0` itself counts as the single one-digit number) in which the absolute difference between every two consecutive digits equals `k`. Return the qualifying numbers in increasing order as an integer list.

**Example 1:**
```
Input: n = 3, k = 7
Output: [181,292,707,818,929]
Explanation: Only 181, 292, 707, 818 and 929 have every neighbouring digit pair differ by 7.
```

**Example 2:**
```
Input: n = 2, k = 1
Output: [10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]
Explanation: Sixteen two-digit numbers step by exactly 1 between their digits, from 10 up to 98.
```

**Example 3:**
```
Input: n = 2, k = 0
Output: [11,22,33,44,55,66,77,88,99]
Explanation: Both digits must match, giving the nine repdigits 11 through 99.
```

**Constraints:**
- `1 <= n <= 9`
- `0 <= k <= 9`
- The answers form an integer list.
