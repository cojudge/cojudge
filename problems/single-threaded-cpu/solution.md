## Approach

Sort tasks by enqueue time while remembering original indices. Simulate the CPU clock: push every task whose enqueue time has arrived into a min-heap ordered by `(processingTime, index)`. When the heap is empty, jump the clock to the next enqueue time. Repeatedly pop the heap, advance the clock by the processing time, and record the index.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting plus heap operations.
- **Space Complexity:** O(n) for the sorted copy and heap.

## Implementation

```python
from typing import List
import heapq
class Solution:
    def getOrder(self, tasks: List[List[int]]) -> List[int]:
        indexed = sorted([(t[0], t[1], i) for i, t in enumerate(tasks)])
        heap = []
        res, i, time = [], 0, 0
        n = len(tasks)
        while len(res) < n:
            if not heap and time < indexed[i][0]:
                time = indexed[i][0]
            while i < n and indexed[i][0] <= time:
                e, p, idx = indexed[i]
                heapq.heappush(heap, (p, idx))
                i += 1
            p, idx = heapq.heappop(heap)
            time += p
            res.append(idx)
        return res
```
