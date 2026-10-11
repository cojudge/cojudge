You are given an integer array `nums` and an integer `k`. A *subarray* is a contiguous block of the array. Determine the greatest length among all subarrays whose elements add up to exactly `k`. If no such subarray exists, return `0`.

**Example 1:**
```
Input: nums = [1,-1,5,-2,3], k = 3
Output: 4
Explanation: The block [1,-1,5,-2] sums to 3 and has length 4, which is the longest achievable.
```

**Example 2:**
```
Input: nums = [-2,-1,2,1], k = 1
Output: 2
Explanation: The block [-1,2] sums to 1 with length 2, beating every other qualifying block.
```

**Example 3:**
```
Input: nums = [1,2,3], k = 3
Output: 2
Explanation: The block [1,2] sums to 3; the single element [3] also qualifies but is shorter.
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `-10^9 <= k <= 10^9`
