You are given an integer array `nums` that may hold negative values, plus a target integer `k`. Consider all non-empty contiguous segments of the array. Each segment has a sum and a length.

Find the length of the shortest segment whose sum is at least `k`. If no segment reaches the target, return `-1`.

The challenge is that negatives prevent a simple sliding window, so a method that handles arbitrary values is required.

**Example 1:**
```
Input: nums = [1], k = 1
Output: 1
Explanation: The whole array sums to 1 with length 1.
```

**Example 2:**
```
Input: nums = [1,2], k = 4
Output: -1
Explanation: The total 3 is below 4, so nothing qualifies.
```

**Example 3:**
```
Input: nums = [2,-1,2], k = 3
Output: 3
Explanation: Only the full array reaches 3.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^5 <= nums[i] <= 10^5`
- `1 <= k <= 10^9`
