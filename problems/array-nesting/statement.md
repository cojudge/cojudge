Given a permutation `nums` of `0..n-1`, define the chain starting at `k` by repeated indexing: `k, nums[k], nums[nums[k]]`, and so on until a value repeats. Let `S(k)` be the set of distinct values on that chain. Return the largest possible `|S(k)|` over all starts.

Because every index has exactly one outgoing edge, the chains are disjoint cycles with trees feeding into them; the longest chain always equals the longest directed cycle. Marking visited indices keeps the total work linear.

**Example 1:**
```
Input: nums = [5,4,0,3,1,6,2]
Output: 4
Explanation: Starting at 0 gives 0 -> 5 -> 6 -> 2, four distinct values.
```

**Example 2:**
```
Input: nums = [0,1,2]
Output: 1
Explanation: Every element points to itself, so each chain has length 1.
```

**Example 3:**
```
Input: nums = [1,2,0]
Output: 3
Explanation: The single cycle visits all three indices.
```

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `nums` is a permutation of `[0, nums.length - 1]`.
