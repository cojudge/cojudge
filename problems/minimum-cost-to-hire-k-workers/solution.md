## Approach

Pay is governed by the largest wage-to-quality ratio in the hired group, so sorting everyone by that ratio turns the problem into picking the cheapest companions for each possible rate-setter. While scanning the sorted order, keep the `k` smallest qualities seen so far with a max-heap and track their sum; multiplying the sum by the current ratio gives the cheapest total using the current person as the rate. The minimum over the scan is the answer, returned as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting plus O(n log k) heap work.
- **Space Complexity:** O(n) for the ordering and O(k) for the heap.

## Implementation

```python
import heapq
from typing import List

class Solution:
    def mincostToHireWorkers(self, quality: List[int], wage: List[int], k: int) -> str:
        order = sorted(range(len(quality)), key=lambda i: wage[i] / quality[i])
        heap = []
        sum_q = 0
        best = float('inf')
        for i in order:
            heapq.heappush(heap, -quality[i])
            sum_q += quality[i]
            if len(heap) > k:
                sum_q += heapq.heappop(heap)
            if len(heap) == k:
                best = min(best, sum_q * wage[i] / quality[i])
        return str(best)
```
