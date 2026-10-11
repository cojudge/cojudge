## Approach

Push the head of every list into a min-heap and note the largest head as the running maximum, so [heap-min, running-max] always covers all lists. Pop the minimum to form a candidate, keep it when it narrows the best span (or ties with a smaller start), then push the next element from the same list and refresh the maximum. Stop once any list is exhausted, since no further range can cover it.

## Complexity Analysis

- **Time Complexity:** O(N log k), where N is total elements and k the list count.
- **Space Complexity:** O(k) for the heap.

## Implementation

```python
from typing import List
import heapq
class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        pq = []
        cur_max = float("-inf")
        for i, lst in enumerate(nums):
            heapq.heappush(pq, (lst[0], i, 0))
            cur_max = max(cur_max, lst[0])
        best_a, best_b = 0, float("inf")
        while True:
            v, li, ei = heapq.heappop(pq)
            if cur_max - v < best_b - best_a or (cur_max - v == best_b - best_a and v < best_a):
                best_a, best_b = v, cur_max
            if ei + 1 >= len(nums[li]):
                break
            nv = nums[li][ei + 1]
            heapq.heappush(pq, (nv, li, ei + 1))
            cur_max = max(cur_max, nv)
        return [best_a, best_b]
```
