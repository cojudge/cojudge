Find the leftmost position where the sum of elements strictly to its left equals the sum strictly to its right.

Treat a missing side as zero. For `[1,7,3,6,5,6]`, index `3` works because `1+7+3 = 11` and `5+6 = 11`.

Return that index, or `-1` when every position is unbalanced.

**Example 1:**
```
Input: nums = [1,7,3,6,5,6]
Output: 3
Explanation: Both sides of index 3 add to 11.
```

**Example 2:**
```
Input: nums = [1,2,3]
Output: -1
Explanation: No split equalizes the two sides.
```

**Example 3:**
```
Input: nums = [2,1,-1]
Output: 0
Explanation: Empty left sums to 0 and 1 + -1 also sums to 0.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-1000 <= nums[i] <= 1000`
