You are given an integer array `nums` and an integer `k`. Decide whether the entries can be split into `k` groups, each containing at least one element, so that every group adds up to the same total. Return `true` when such a split exists and `false` otherwise.

**Example 1:**
```
Input: nums = [4,3,2,3,5,2,1], k = 4
Output: true
Explanation: The elements can be grouped as (5), (1, 4), (2,3), (2,3), each totaling the same amount.
```

**Example 2:**
```
Input: nums = [1,2,3,4], k = 3
Output: false
```

**Constraints:**

- `1 <= k <= nums.length <= 16`
- `1 <= nums[i] <= 10^4`
- The frequency of each element is in the range `[1, 4]`.
