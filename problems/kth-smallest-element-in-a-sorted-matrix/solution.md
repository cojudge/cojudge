## Approach

Push the head of each row into a min-heap keyed by cell value. Remove the minimum `k` times, each time inserting the popped cell's right neighbor so the heap always holds the next unseen entry of every touched row. The last popped value is the k-th smallest.

## Complexity Analysis

- **Time Complexity:** O(k log n), where n is the matrix side length.
- **Space Complexity:** O(n) for one heap entry per row.

## Implementation

```python
import heapq
from typing import List
class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        pq = [(matrix[r][0], r, 0) for r in range(n)]
        heapq.heapify(pq)
        val = 0
        for _ in range(k):
            val, r, c = heapq.heappop(pq)
            if c + 1 < len(matrix[r]):
                heapq.heappush(pq, (matrix[r][c + 1], r, c + 1))
        return val
```
