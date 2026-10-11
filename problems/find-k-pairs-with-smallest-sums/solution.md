## Approach

Seed a min-heap with the first column of every first-array row, then pop the smallest sum `want` times. Each pop of cell `(i, j)` queues its right neighbor `(i, j+1)` and its lower neighbor `(i+1, j)` when unseen, so the heap always holds the current frontier of candidate sums.

## Complexity Analysis

- **Time Complexity:** O(k log k), with one heap step per returned pair.
- **Space Complexity:** O(k) for the heap and the visited index set.

## Implementation

```python
import heapq
from typing import List
class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        want = min(k, len(nums1) * len(nums2))
        pq = [(nums1[0] + nums2[0], 0, 0)]
        seen = {(0, 0)}
        out = []
        while len(out) < want and pq:
            _, i, j = heapq.heappop(pq)
            out.append([nums1[i], nums2[j]])
            if i + 1 < len(nums1) and (i + 1, j) not in seen:
                seen.add((i + 1, j))
                heapq.heappush(pq, (nums1[i + 1] + nums2[j], i + 1, j))
            if j + 1 < len(nums2) and (i, j + 1) not in seen:
                seen.add((i, j + 1))
                heapq.heappush(pq, (nums1[i] + nums2[j + 1], i, j + 1))
        return out
```
