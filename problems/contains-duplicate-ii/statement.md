You receive an integer array `nums` together with an integer `k`. Determine whether two separate positions `i` and `j` exist with matching values (`nums[i] == nums[j]`) whose separation satisfies `abs(i - j) <= k`. Return `true` when such a close repeated pair exists, and `false` otherwise.

**Example 1:**
```
Input: nums = [1,2,3,1], k = 3
Output: true
```

**Example 2:**
```
Input: nums = [1,0,1,1], k = 1
Output: true
```

**Example 3:**
```
Input: nums = [1,2,3,1,2,3], k = 2
Output: false
```

**Constraints:**
- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `0 <= k <= 10^5`
