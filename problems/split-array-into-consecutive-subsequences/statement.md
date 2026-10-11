You are given a non-decreasing array `nums`.

Decide whether it can be split into one or more groups such that every group holds at least three numbers and the numbers in each group are consecutive integers (for example [3,4,5]). Every array entry must belong to exactly one group.

**Example 1:**
```
Input: nums = [1,2,3,3,4,5]
Output: true
Explanation: Split into [1,2,3] and [3,4,5].
```

**Example 2:**
```
Input: nums = [1,2,3,3,4,4,5,5]
Output: true
Explanation: Split into [1,2,3,4,5] and [3,4,5].
```

**Example 3:**
```
Input: nums = [1,2,3,4,4,5]
Output: false
Explanation: No partition gives every group length 3 or more.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-1000 <= nums[i] <= 1000`
- `nums` is sorted in non-decreasing order.
