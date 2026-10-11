## Approach

Decode each triple into a `(depth, position) -> value` table. From the root `(1, 1)`, recurse to children `(d+1, 2p-1)` and `(d+1, 2p)` carrying the running sum. When neither child exists in the table, the accumulated sum is one complete path; add it to the answer.

## Complexity Analysis

- **Time Complexity:** O(n) for n codes.
- **Space Complexity:** O(n) for the table plus recursion depth.

## Implementation

```python
from typing import List
class Solution:
    def pathSum(self, nums: List[int]) -> int:
        val = {}
        for x in nums:
            d, p, v = x // 100, (x // 10) % 10, x % 10
            val[(d, p)] = v
        def dfs(d, p, cur):
            if (d, p) not in val:
                return 0
            cur += val[(d, p)]
            has_l = (d + 1, 2 * p - 1) in val
            has_r = (d + 1, 2 * p) in val
            if not has_l and not has_r:
                return cur
            return dfs(d + 1, 2 * p - 1, cur) + dfs(d + 1, 2 * p, cur)
        return dfs(1, 1, 0)
```
