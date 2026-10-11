You are given stick lengths in `nums`. Pick any three sticks that can form a non-degenerate triangle, meaning the sum of the two shorter sides strictly exceeds the longest side. Maximize the perimeter (the sum of the three chosen lengths). Return that maximum perimeter, or `0` when no triple works.

**Example 1:**
```
Input: nums = [2,1,2]
Output: 5
Explanation: Sticks 2, 1, 2 satisfy 1 + 2 > 2 and total 5.
```

**Example 2:**
```
Input: nums = [1,2,1,10]
Output: 0
Explanation: Every triple violates the triangle rule.
```

**Constraints:**
- `3 <= nums.length <= 10000`
- `1 <= nums[i] <= 10^6`
