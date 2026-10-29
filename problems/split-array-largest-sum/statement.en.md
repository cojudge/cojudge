You receive an integer list `nums` and an integer `k`. Cut `nums` into `k` neighbouring blocks that are all non-empty, aiming to push the biggest block total down as far as possible.

Hand back that smallest achievable biggest-block total.

A block here means a run of neighbours from the list with no gaps.

**Constraints:**
- `1 <= nums.length <= 1000`
- `0 <= nums[i] <= 10^6`
- `1 <= k <= min(50, nums.length)`
