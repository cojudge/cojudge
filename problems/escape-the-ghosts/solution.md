## Approach

Without obstacles the fastest route between two cells uses exactly the
Manhattan distance. Measure how far you must walk from the origin to the
destination and how far each ghost must walk to that same cell. You win when
your distance is strictly less than every ghost distance; otherwise a ghost
can arrive first or at the same moment and block you.

## Complexity Analysis

- **Time Complexity:** O(g), where g is the ghost count.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List


class Solution:
    def escapeGhosts(self, ghosts: List[List[int]], target: List[int]) -> bool:
        me = abs(target[0]) + abs(target[1])
        for x, y in ghosts:
            if abs(x - target[0]) + abs(y - target[1]) <= me:
                return False
        return True
```
