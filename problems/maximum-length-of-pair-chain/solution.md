## Approach

Sort the pairs by right endpoint and sweep once, keeping the end of the last chosen pair. Any pair starting strictly after that end extends the chain and becomes the new benchmark. Earliest-ending pairs block the least future room, which makes this greedy order optimal.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting n pairs, plus O(n) for the sweep.
- **Space Complexity:** O(1) beyond the sort.

## Implementation

```python
from typing import List

class Solution:
    def findLongestChain(self, pairs: List[List[int]]) -> int:
        pairs = sorted(pairs, key=lambda p: p[1])
        count = 0
        end = None
        for a, b in pairs:
            if end is None or a > end:
                count += 1
                end = b
        return count
```
