You are given intervals `intervals`, where each entry `[start, end]` stands for all integers from `start` through `end` inclusive.

A containing set is a collection of integers that holds at least two distinct numbers inside every interval. Return the smallest possible size of such a set.

**Example 1:**
```
Input: intervals = [[1,3],[3,7],[8,9]]
Output: 5
Explanation: One minimal choice is [2,3,4,8,9]: the first interval holds 2,3, the second holds 3,4 (or 4,7 variants), and the third holds 8,9.
```

**Example 2:**
```
Input: intervals = [[1,3],[1,4],[2,5],[3,5]]
Output: 3
Explanation: The set [2,3,4] meets every interval twice, and no two-element set can.
```

**Example 3:**
```
Input: intervals = [[1,2],[2,3],[2,4],[4,5]]
Output: 5
Explanation: Only the full range [1,2,3,4,5] covers the tight ends twice.
```

**Constraints:**
- `1 <= intervals.length <= 3000`
- Each interval has exactly 2 entries `[start, end]`.
- `0 <= start < end <= 10^8`
