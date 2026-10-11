You are given a nonnegative integer `num`. You may exchange two of its decimal digits at most once.

Return the greatest value obtainable after zero or one such exchange. Keeping the number unchanged is allowed.

**Example 1:**
```
Input: num = 2736
Output: 7236
Explanation: Swap 2 and 7 to reach 7236.
```

**Example 2:**
```
Input: num = 9973
Output: 9973
Explanation: No swap beats the original ordering.
```

**Example 3:**
```
Input: num = 98368
Output: 98863
Explanation: Swap the 3 with the last 8.
```

**Constraints:**
- `0 <= num <= 10^8`
