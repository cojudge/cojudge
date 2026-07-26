## Approach

Sort the intervals by left endpoint and process query indices in increasing query-value order. Before answering a query, add every interval whose left endpoint is at most the query to a min-heap keyed by `(length, right endpoint)`. Remove intervals whose right endpoint is before the query. The heap top is then the smallest interval containing that query, and storing answers by original index preserves query order.

## Complexity Analysis

- **Time Complexity:** O(n log n + q log q + (n + q) log n) for sorting and heap operations.
- **Space Complexity:** O(n + q) for the heap, sorted query indices, and result.

## Implementation

```python
import heapq
from typing import List


class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        intervals.sort()
        order = sorted(range(len(queries)), key=queries.__getitem__)
        answer = [-1] * len(queries)
        active = []
        interval_index = 0

        for query_index in order:
            query = queries[query_index]
            while interval_index < len(intervals) and intervals[interval_index][0] <= query:
                left, right = intervals[interval_index]
                heapq.heappush(active, (right - left + 1, right))
                interval_index += 1
            while active and active[0][1] < query:
                heapq.heappop(active)
            if active:
                answer[query_index] = active[0][0]
        return answer
```
