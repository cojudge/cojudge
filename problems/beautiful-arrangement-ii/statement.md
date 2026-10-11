You are given integers `n` and `k` with `1 <= k < n`.

Build a list holding each number from 1 to `n` exactly once such that the absolute gaps between neighbours take exactly `k` distinct values.

Return any such list.

**Example 1:**
```
Input: n = 3, k = 1
Output: [1,2,3]
Explanation: Both gaps equal 1.
```

**Example 2:**
```
Input: n = 3, k = 2
Output: [1,3,2]
Explanation: Gaps are 2 then 1.
```

**Example 3:**
```
Input: n = 5, k = 4
Output: [1,5,2,4,3]
Explanation: Gaps 4, 3, 2, 1 cover four values.
```

**Constraints:**
- `1 <= k < n <= 10^4`
