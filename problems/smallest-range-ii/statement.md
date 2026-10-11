You are given an integer array `nums` and an integer `k`. You must adjust every element by exactly `k`: each `nums[i]` becomes either `nums[i] + k` or `nums[i] - k` (your choice per element).

After all adjustments, the score is the difference between the largest and the smallest value. Return the smallest score you can achieve.

**Example 1:**
```
Input: nums = [1], k = 0
Output: 0
```

**Example 2:**
```
Input: nums = [0,10], k = 2
Output: 6
Explanation: Adjust to [2,8]; the spread is 6.
```

**Example 3:**
```
Input: nums = [1,3,6], k = 3
Output: 3
Explanation: Adjust to [4,6,3]; the spread is 6 - 3 = 3.
```

**Constraints:**
- `1 <= nums.length <= 2000`
- `0 <= nums[i] <= 10000`
- `0 <= k <= 10000`
