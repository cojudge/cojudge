## Approach

Sort projects by required capital and use a max-heap of profits. Do up to `k` rounds: push every affordable project into the heap, then take the most profitable one and add it to the current capital. Stop early if no project is affordable.

## Complexity Analysis

- **Time Complexity:** O(n log n + k log n), where n is the number of projects. Sorting costs O(n log n) and each heap operation costs O(log n).
- **Space Complexity:** O(n) for the sorted indices and the heap.

## Implementation

```python
import heapq
class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: list[int], capital: list[int]) -> int:
        order = sorted(range(len(profits)), key=lambda i: capital[i])
        heap = []
        i = 0
        cur = w
        for _ in range(k):
            while i < len(order) and capital[order[i]] <= cur:
                heapq.heappush(heap, -profits[order[i]])
                i += 1
            if not heap:
                break
            cur += -heapq.heappop(heap)
        return cur
```
