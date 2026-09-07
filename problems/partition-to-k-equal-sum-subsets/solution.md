## Approach

Every subset must sum to `target = sum(nums) / k`, so if the total is not divisible by `k` the answer is `false`. The problem is solved with bitmask DP `dp(mask, cur)`: `mask` records which numbers have been assigned, and `cur` is the length of the subset currently being filled (it resets to 0 whenever it reaches `target`). For each unused position `i`, if adding `nums[i]` does not overflow `target`, recurse on the updated mask with the folded current sum. The memo key is just the mask, because the current sum is determined by `sum(mask) % target`. If the full mask is reached, every subset was filled exactly, so return `true`.

## Complexity Analysis

- **Time Complexity:** O(n * 2^n), where n is the length of `nums` — each mask is visited at most once and scans up to n choices.
- **Space Complexity:** O(2^n) for the memoization table plus O(n) recursion depth.

## Implementation

```python
from typing import List


class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k != 0:
            return False
        target = total // k
        n = len(nums)
        seen = [False] * (1 << n)

        def dfs(mask: int, cur: int) -> bool:
            if mask == (1 << n) - 1:
                return True
            if seen[mask]:
                return False
            seen[mask] = True
            for i in range(n):
                if mask & (1 << i):
                    continue
                nxt = cur + nums[i]
                if nxt > target:
                    continue
                if dfs(mask | (1 << i), 0 if nxt == target else nxt):
                    return True
            return False

        return dfs(0, 0)
```