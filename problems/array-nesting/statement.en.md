Given a permutation `nums` of `0..n-1`, define the chain starting at `k` by repeated indexing: `k, nums[k], nums[nums[k]]`, and so on until a value repeats. Let `S(k)` be the set of distinct values on that chain. Return the largest possible `|S(k)|` over all starts.

Because every index has exactly one outgoing edge, the chains are disjoint cycles with trees feeding into them; the longest chain always equals the longest directed cycle. Marking visited indices keeps the total work linear.

**Constraints:**
- `1 <= nums.length <= 2 * 10^4`
- `nums` is a permutation of `[0, nums.length - 1]`.
