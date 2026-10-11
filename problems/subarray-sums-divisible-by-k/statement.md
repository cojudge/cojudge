Given an integer array `nums` and a positive integer `k`, count the contiguous subarrays whose element total is a multiple of `k`.

A subarray is any non-empty consecutive slice `nums[i..j]`. Its total must satisfy `sum % k == 0`.

**Example 1:**
```
Input: nums = [4,5,0,-2,-3,1], k = 5
Output: 7
Explanation: Seven slices qualify, among them the whole array and the single element [5].
```

**Example 2:**
```
Input: nums = [5], k = 9
Output: 0
Explanation: The only slice totals 5, which is not divisible by 9.
```

**Constraints:**
- `1 <= nums.length <= 30000`
- `-10000 <= nums[i] <= 10000`
- `2 <= k <= 10000`
