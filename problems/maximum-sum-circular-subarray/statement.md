Think of `nums` as a ring of length `n` rather than a line: positions after the final entry continue at the first entry. Report the largest total attainable by any **non-empty** contiguous block on that ring.

In ring terms, the successor of position `nums[i]` is `nums[(i + 1) % n]` and its predecessor is `nums[(i - 1 + n) % n]`.

No slot of the underlying storage `nums` may be reused within one block. In other words, for a block written `nums[i], nums[i + 1], ..., nums[j]`, there are no indices `i <= k1, k2 <= j` with `k1 % n == k2 % n` unless `k1 == k2`.

**Constraints:**

- `n == nums.length`
- `1 <= n <= 3 * 10^4`
- `-3 * 10^4 <= nums[i] <= 3 * 10^4`
