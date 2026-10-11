You are given a permutation `nums` of the integers `0` through `n - 1`.

A global inversion is a pair of positions `i < j` with `nums[i] > nums[j]`. A local inversion is an index `i` with `nums[i] > nums[i+1]` (an adjacent global inversion). Every local inversion is global, but not vice versa.

Return `true` when the two counts coincide and `false` otherwise.

**Example 1:**
```
Input: nums = [1,0,2]
Output: true
Explanation: The only global inversion is (1,0), which is also the only local one.
```

**Example 2:**
```
Input: nums = [1,2,0]
Output: false
Explanation: Global inversions are (1,0) and (2,0) but only (2,0) at indices 1-2 is local.
```

**Example 3:**
```
Input: nums = [0,2,1]
Output: true
Explanation: One global inversion (2,1) and the same single local inversion.
```

**Constraints:**
- `n == nums.length`
- `1 <= n <= 10^5`
- `0 <= nums[i] < n`
- All values are distinct
