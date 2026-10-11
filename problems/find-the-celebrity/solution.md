## Approach

Pick a candidate by scanning people: whenever the current candidate knows i, discard the candidate and take i. Then verify the survivor is known by all others and knows none of them; otherwise no celebrity exists.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def findCelebrity(self, graph: List[List[int]]) -> int:
        n = len(graph)
        if n == 0:
            return -1
        cand = 0
        for i in range(1, n):
            if graph[cand][i] == 1:
                cand = i
        for i in range(n):
            if i == cand:
                continue
            if graph[cand][i] == 1:
                return -1
            if graph[i][cand] == 0:
                return -1
        return cand
```
