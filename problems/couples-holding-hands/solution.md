## Approach

Index every person to their current chair, then fix the couches from left to right. For the couch starting at an even chair, look up where the partner of its first occupant sits; if they are not already together, swap that partner next to them. Each swap settles the current couch without disturbing earlier ones, which keeps the total minimal.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the row length, for one linear pass with constant-time swaps.
- **Space Complexity:** O(n) for the position table.

## Implementation

```python
from typing import List
class Solution:
    def minSwapsCouples(self, row: List[int]) -> int:
        pos = {v: i for i, v in enumerate(row)}
        swaps = 0
        for i in range(0, len(row), 2):
            partner = row[i] + 1 if row[i] % 2 == 0 else row[i] - 1
            if row[i + 1] == partner:
                continue
            j = pos[partner]
            tmp = row[i + 1]
            row[i + 1], row[j] = row[j], tmp
            pos[tmp] = j
            pos[partner] = i + 1
            swaps += 1
        return swaps
```
