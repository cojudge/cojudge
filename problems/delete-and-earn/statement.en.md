You are given an array `nums` of positive integers. You repeatedly pick a value `v` that still appears, gaining `v` points for every remaining copy of `v`, and simultaneously removing all copies of `v - 1` and `v + 1` (they award nothing). Each copy can be used at most once.

Return the maximum total points achievable.

**Constraints:**
- `1 <= nums.length <= 20000`
- `1 <= nums[i] <= 10000`
