You are given a binary array `nums` and an integer `k`. In one move you may pick
any `k` consecutive elements and flip every bit in that window (`0` becomes
`1` and `1` becomes `0`).

Return the smallest number of moves that turns every element into `1`. If it
is impossible, return `-1`.

**Constraints:**
- `1 <= nums.length <= 10^5`
- `nums[i]` is `0` or `1`.
- `1 <= k <= nums.length`
