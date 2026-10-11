Given an integer array `nums` and an integer `k`, count the contiguous subarrays
that contain exactly `k` distinct values.

A subarray is a non-empty slice of consecutive elements.

**Example 1:**
```
Input: nums = [1,2,1,2,3], k = 2
Output: 7
Explanation: The qualifying windows are [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2] and [1,2,1,2].
```

**Example 2:**
```
Input: nums = [1,2,1,3,4], k = 3
Output: 3
Explanation: The qualifying windows are [1,2,1,3], [2,1,3] and [1,3,4].
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `1 <= nums[i], k <= nums.length`
