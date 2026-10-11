Consider every unordered pair of positions in `nums` and record the absolute difference of the two values. Sort those distances increasingly and pick the `k`-th entry (1-based).

Return that distance. For example, `[1,3,1]` yields distances `0, 2, 2`, whose first entry is `0`.

**Example 1:**
```
Input: nums = [1,3,1], k = 1
Output: 0
Explanation: Sorted distances are [0,2,2]; the first is 0.
```

**Example 2:**
```
Input: nums = [1,1,1], k = 2
Output: 0
Explanation: All three pairs have distance 0.
```

**Example 3:**
```
Input: nums = [1,6,1], k = 3
Output: 5
Explanation: Sorted distances are [0,5,5]; the third is 5.
```

**Constraints:**
- `2 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= n*(n-1)/2`
