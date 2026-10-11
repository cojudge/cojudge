You receive an integer array `nums`. Decide whether it can be divided into two non-empty groups `A` and `B` that together use every element exactly once and whose arithmetic means are equal.

Equal means imply that some non-empty proper subset has sum `total * k / n`, where `k` is its size and `n` is the full length, so the divisibility condition must hold exactly with integers.

**Constraints:**
- `1 <= nums.length <= 30`
- `0 <= nums[i] <= 10^4`
