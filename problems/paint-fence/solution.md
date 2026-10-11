## Approach

Keep two counts: colorings where the last two posts match (same) and where they differ (diff). Start with same = k and diff = k*(k-1) for two posts, then for each further post the new same equals old diff and the new diff equals (same + diff) * (k-1).

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def numWays(self, n: int, k: int) -> int:
        if n == 0 or k == 0:
            return 0
        if n == 1:
            return k
        if n == 2:
            return k * k
        if k == 1:
            return 0
        same, diff = k, k * (k - 1)
        for _ in range(3, n + 1):
            same, diff = diff, (same + diff) * (k - 1)
        return same + diff
```
