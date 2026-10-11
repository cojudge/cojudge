## Approach

Sort the citation counts ascending. Then try h from n down to 1 and return the first h where the element at position n - h reaches h, which means h papers have at least h citations.

## Complexity Analysis

- **Time Complexity:** O(n log n) for sorting.
- **Space Complexity:** O(1) extra.

## Implementation

```python
from typing import List
class Solution:
    def hIndex(self, citations: List[int]) -> int:
        citations = sorted(citations)
        n = len(citations)
        for h in range(n, 0, -1):
            if citations[n - h] >= h:
                return h
        return 0
```
