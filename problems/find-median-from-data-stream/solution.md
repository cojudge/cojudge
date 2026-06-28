## Approach

Maintain two heaps: a max-heap for the smaller half of numbers and a min-heap for the larger half. By keeping the heaps balanced (sizes differ by at most 1), the median is either the max of the small heap or the average of both tops.

## Complexity Analysis

- **Time Complexity:** O(log n) for addNum, O(1) for findMedian.
- **Space Complexity:** O(n) to store all numbers.

## Implementation

```python
import heapq
from typing import List
class MedianFinder:
    def __init__(self):
        self.small = []
        self.large = []
    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0
class Solution:
    def solve(self, operations: List[str], values: List[List[int]]) -> List[str]:
        result = []
        obj = None
        for i, op in enumerate(operations):
            if op == "MedianFinder":
                obj = MedianFinder()
                result.append("null")
            elif op == "addNum":
                obj.addNum(values[i][0])
                result.append("null")
            elif op == "findMedian":
                med = obj.findMedian()
                if med == int(med):
                    result.append(str(int(med)) + ".0")
                else:
                    result.append(str(med))
        return result
```
