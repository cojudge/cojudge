You are given an array `nums`.

Decide whether it can become non-decreasing (each entry less than or equal to the next) by changing at most one entry to any value.

**Example 1:**
```
Input: nums = [4,2,3]
Output: true
Explanation: Change 4 to 1 for [1,2,3].
```

**Example 2:**
```
Input: nums = [4,2,1]
Output: false
Explanation: Two drops remain after any single edit.
```

**Example 3:**
```
Input: nums = [3,4,2,3]
Output: false
Explanation: Neither fixing the 4 nor the 2 removes all violations.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^5 <= nums[i] <= 10^5`
