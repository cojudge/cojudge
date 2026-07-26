## Approach

Sort the points by squared Euclidean distance, which preserves the same ordering as the actual distance without computing square roots. Return the first `k` points; any ordering among points tied at the cutoff is valid.

## Complexity Analysis

- **Time Complexity:** O(n log n), where `n` is the number of points.
- **Space Complexity:** O(n) for the sorted copy and returned slice.

## Implementation

```python
from typing import List


class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        return sorted(points, key=lambda point: point[0] * point[0] + point[1] * point[1])[:k]
```
