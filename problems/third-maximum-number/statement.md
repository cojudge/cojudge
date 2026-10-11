From the array `nums`, consider its distinct values sorted from largest to smallest. Return the third one. When fewer than three distinct values exist, return the largest value instead.

Duplicates are collapsed first: `[2,2,3,1]` behaves like `[3,2,1]`.

**Example 1:**
```
Input: nums = [3,2,1]
Output: 1
```

**Example 2:**
```
Input: nums = [1,2]
Output: 2
Explanation: Only two distinct numbers exist, so the maximum wins.
```

**Example 3:**
```
Input: nums = [2,2,3,1]
Output: 1
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-2^31 <= nums[i] <= 2^31 - 1`
