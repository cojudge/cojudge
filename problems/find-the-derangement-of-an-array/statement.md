Start from the sorted array `[1, 2, ..., n]`. A derangement is a rearrangement where no value stays in its original slot (so 1 is not first, 2 is not second, and so on).

Count how many derangements exist, returning the total modulo 1000000007.

**Example 1:**
```
Input: n = 3
Output: 2
Explanation: Valid orders are [2,3,1] and [3,1,2].
```

**Example 2:**
```
Input: n = 2
Output: 1
```

**Example 3:**
```
Input: n = 1
Output: 0
```

**Constraints:**
- `1 <= n <= 10^6`
