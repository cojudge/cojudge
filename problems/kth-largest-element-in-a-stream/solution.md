## Approach

Maintain a min-heap containing the `k` largest stream values seen so far. After trimming the initial values to `k`, insert each addition, remove the minimum if the heap grows past `k`, and record the heap root as the current kth largest value.

## Complexity Analysis

- **Time Complexity:** O(N log N + A log k) in the worst case, where `N` is `nums.length` and `A` is `additions.length`.
- **Space Complexity:** O(N + A) including the returned array; the heap uses O(N) space at its initialization peak.

## Implementation

```python
import heapq
from typing import List


class Solution:
    def kthLargestStream(self, k: int, nums: List[int], additions: List[int]) -> List[int]:
        heap = nums[:]
        heapq.heapify(heap)
        while len(heap) > k:
            heapq.heappop(heap)

        result = []
        for value in additions:
            heapq.heappush(heap, value)
            if len(heap) > k:
                heapq.heappop(heap)
            result.append(heap[0])
        return result
```
