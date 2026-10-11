You are given an array `nums` of positive integers. You repeatedly pick a value `v` that still appears, gaining `v` points for every remaining copy of `v`, and simultaneously removing all copies of `v - 1` and `v + 1` (they award nothing). Each copy can be used at most once.

Return the maximum total points achievable.

**Example 1:**
```
Input: nums = [3,4,2]
Output: 6
Explanation: Take all 4s (4 points), delete 3, then take the 2 (2 points) for 6 total.
```

**Example 2:**
```
Input: nums = [2,2,3,3,3,4]
Output: 9
Explanation: Take the three 3s for 9; the 2s and 4 are removed.
```

**Example 3:**
```
Input: nums = [1]
Output: 1
```

**Constraints:**
- `1 <= nums.length <= 20000`
- `1 <= nums[i] <= 10000`
