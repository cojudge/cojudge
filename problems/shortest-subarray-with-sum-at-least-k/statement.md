You are given an integer array `nums` that may hold negative values, plus a target integer `k`. Consider all non-empty contiguous segments of the array. Each segment has a sum and a length.

Find the length of the shortest segment whose sum is at least `k`. If no segment reaches the target, return `-1`.

The challenge is that negatives prevent a simple sliding window, so a method that handles arbitrary values is required.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^5 <= nums[i] <= 10^5`
- `1 <= k <= 10^9`
