## Approach

Every nut except possibly the first costs a full round trip from the tree, giving a baseline of twice each tree-to-nut Manhattan distance. Fetching nut `i` first instead swaps one tree leg for the squirrel-to-nut leg, shifting the total by `dist(squirrel, i) - dist(tree, i)`. Evaluating that shift for every nut and keeping the smallest yields the optimal total.

## Complexity Analysis

- **Time Complexity:** O(t), where t is the number of nuts.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List

class Solution:
    def minDistance(self, height: int, width: int, tree: List[int], squirrel: List[int], nuts: List[List[int]]) -> int:
        def dist(a, b):
            return abs(a[0] - b[0]) + abs(a[1] - b[1])
        total = 0
        best = float("inf")
        for nut in nuts:
            d = dist(tree, nut)
            total += 2 * d
            best = min(best, dist(squirrel, nut) - d)
        return total + best
```
