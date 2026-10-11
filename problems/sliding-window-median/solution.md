## Approach

Maintain the current window in two heaps: a max-heap holds the lower half and a min-heap holds the upper half, with sizes kept within one of each other. Insertions go to the appropriate heap, removals are recorded lazily in a delay map and pruned from heap tops, and rebalancing restores the size rule. The median is then either the max-heap top (odd window) or the mean of both tops (even window), formatted as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(n log k) for n windows with heap operations.
- **Space Complexity:** O(k) for the heaps and delay map.

## Implementation

```python
import heapq
from collections import defaultdict
from typing import List

class Solution:
    def medianSlidingWindow(self, nums: List[int], k: int) -> List[str]:
        small: List[int] = []  # max-heap via negatives
        large: List[int] = []  # min-heap
        delayed: dict = defaultdict(int)
        small_size = 0
        large_size = 0

        def prune(heap, is_small: bool) -> None:
            while heap:
                v = -heap[0] if is_small else heap[0]
                if delayed.get(v, 0) == 0:
                    break
                heapq.heappop(heap)
                delayed[v] -= 1
                if delayed[v] == 0:
                    del delayed[v]

        def balance() -> None:
            nonlocal small_size, large_size
            if small_size > large_size + 1:
                v = -heapq.heappop(small)
                heapq.heappush(large, v)
                small_size -= 1
                large_size += 1
                prune(small, True)
            elif small_size < large_size:
                v = heapq.heappop(large)
                heapq.heappush(small, -v)
                small_size += 1
                large_size -= 1
                prune(large, False)

        out: List[str] = []
        for i, v in enumerate(nums):
            if not small or v <= -small[0]:
                heapq.heappush(small, -v)
                small_size += 1
            else:
                heapq.heappush(large, v)
                large_size += 1
            balance()
            if i >= k:
                old = nums[i - k]
                delayed[old] += 1
                if old <= -small[0]:
                    small_size -= 1
                    if old == -small[0]:
                        prune(small, True)
                else:
                    large_size -= 1
                    if large and old == large[0]:
                        prune(large, False)
                balance()
            if i >= k - 1:
                if k % 2 == 1:
                    out.append(repr(float(-small[0])))
                else:
                    out.append(repr((-small[0] + large[0]) / 2.0))
        return out
```
