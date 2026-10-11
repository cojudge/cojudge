## Approach

Collect the distinct candy types into a set. Alice takes exactly half the pile, so she can cover at most that many types, and at most the number of distinct types available. The minimum of the two bounds is always achievable by picking one candy from distinct types first.

## Complexity Analysis

- **Time Complexity:** O(n) for a single pass into the set.
- **Space Complexity:** O(n) for the distinct values.

## Implementation

```python
from typing import List

class Solution:
    def distributeCandies(self, candyType: List[int]) -> int:
        return min(len(set(candyType)), len(candyType) // 2)
```
