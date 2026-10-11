## Approach

Sweep both sorted lists with indices i and j. For the current pair, the overlap candidate is [max of starts, min of ends]; keep it when the start does not pass the end. Then advance the interval finishing first, since it cannot overlap anything later in the other list. Each interval is consumed once.

## Complexity Analysis

- **Time Complexity:** O(m + n), where m and n are the list lengths.
- **Space Complexity:** O(m + n) for the output in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def intervalIntersection(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        out = []
        i = j = 0
        while i < len(firstList) and j < len(secondList):
            lo = max(firstList[i][0], secondList[j][0])
            hi = min(firstList[i][1], secondList[j][1])
            if lo <= hi:
                out.append([lo, hi])
            if firstList[i][1] < secondList[j][1]:
                i += 1
            else:
                j += 1
        return out
```
