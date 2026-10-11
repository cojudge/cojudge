You are given an integer array `nums` and an integer `k`. A subarray is called *good* when it uses at least two consecutive positions and its elements add up to a multiple of `k` (that is, the sum divided by `k` leaves remainder zero; when `k` is zero this means the sum itself must be zero).

Return `true` if `nums` contains at least one good subarray, and `false` otherwise.

**Example 1:**
```
Input: nums = [23,2,4,6,7], k = 6
Output: true
Explanation: The slice [2,4] has length 2 and sums to 6, which is 1 times 6.
```

**Example 2:**
```
Input: nums = [23,2,6,4,7], k = 6
Output: true
Explanation: The whole array sums to 42, which is 7 times 6.
```

**Example 3:**
```
Input: nums = [23,2,6,4,7], k = 13
Output: false
Explanation: No contiguous slice of length 2 or more sums to a multiple of 13.
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `0 <= nums[i] <= 10^9`
- `0 <= k <= 2^31 - 1`
