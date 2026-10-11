You are handed a fixed array `nums` plus a batch of `queries`, where each query is a pair
`[left, right]` with `0 <= left <= right`. For every query, report the sum of
`nums[left] + ... + nums[right]`. (This is the function-style view of the classic
immutable prefix-sum design task: precompute once, then answer each query fast.)

**Example 1:**
```
Input: nums = [-2,0,3,-5,2,-1], queries = [[0,2],[2,5],[0,5]]
Output: [1,-1,-3]
Explanation: Sums of [-2,0,3], [3,-5,2,-1], and the whole array.
```

**Example 2:**
```
Input: nums = [1], queries = [[0,0]]
Output: [1]
Explanation: A single-cell range returns the cell itself.
```

**Example 3:**
```
Input: nums = [1,2,3], queries = [[0,2],[1,1]]
Output: [6,2]
Explanation: Whole-array sum is 6; the middle cell alone is 2.
```

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^5 <= nums[i] <= 10^5`
- `1 <= queries.length <= 10^4`, each query holds exactly two indices.
