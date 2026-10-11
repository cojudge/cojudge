Consider every unordered pair of positions in `nums` and record the absolute difference of the two values. Sort those distances increasingly and pick the `k`-th entry (1-based).

Return that distance. For example, `[1,3,1]` yields distances `0, 2, 2`, whose first entry is `0`.

**Constraints:**
- `2 <= nums.length <= 10^4`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= n*(n-1)/2`
