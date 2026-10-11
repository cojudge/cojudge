An integer array `nums` holding `n` entries is supplied.
Fabricate an array `ans` twice as long (`2n`), defined (using 0-based positions) by `ans[i] == nums[i]` together with `ans[i + n] == nums[i]` for each `0 <= i < n`.

Put differently, `ans` places two successive copies of `nums` back to back.

Hand back `ans`.

**Constraints:**

- n == nums.length
- 1 ≤ n ≤ 1000
- 1 ≤ nums[i] ≤ 1000
