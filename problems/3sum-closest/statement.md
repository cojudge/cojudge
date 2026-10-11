You are given an array `nums` of `n` integers and a target value `target`. Pick three entries at pairwise different positions so that their total is as near as possible to `target`, then return that total.

Every test case is constructed so that exactly one such closest total exists.

**Example 1:**
```
Input: nums = [-1,2,1,-4], target = 1
Output: 2
Explanation: The triple (-1, 2, 1) sums to 2, which is closer to 1 than any other triple sum.
```

**Example 2:**
```
Input: nums = [0,0,0], target = 1
Output: 0
Explanation: The only triple sums to 0.
```

**Constraints:**
- `3 <= nums.length <= 500`
- `-1000 <= nums[i] <= 1000`
- `-10^4 <= target <= 10^4`
