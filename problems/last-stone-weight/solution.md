## Approach

Python's heap is a min-heap, so store every stone as a negative weight to simulate a max-heap. Repeatedly remove the two heaviest stones and insert their difference when they are unequal, then return the remaining weight or zero.

## Complexity Analysis

- **Time Complexity:** O(n log n), where `n` is the number of stones.
- **Space Complexity:** O(n) for the heap.

## Implementation

```python
import heapq
from typing import List


class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        heap = [-stone for stone in stones]
        heapq.heapify(heap)
        while len(heap) > 1:
            y = -heapq.heappop(heap)
            x = -heapq.heappop(heap)
            if x != y:
                heapq.heappush(heap, x - y)
        return -heap[0] if heap else 0
```
