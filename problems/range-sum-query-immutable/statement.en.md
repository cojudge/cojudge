You are handed a fixed array `nums` plus a batch of `queries`, where each query is a pair
`[left, right]` with `0 <= left <= right`. For every query, report the sum of
`nums[left] + ... + nums[right]`. (This is the function-style view of the classic
immutable prefix-sum design task: precompute once, then answer each query fast.)

**Constraints:**
- `1 <= nums.length <= 10^4`
- `-10^5 <= nums[i] <= 10^5`
- `1 <= queries.length <= 10^4`, each query holds exactly two indices.
