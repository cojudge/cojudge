## Approach

View each room as a graph node with directed edges to its keys. Start a stack at room zero, pop rooms, and push any unseen neighbours found inside. Marking on push avoids repeats. If every room gets marked, all are reachable.

## Complexity Analysis

- **Time Complexity:** O(n + E), where n is the room count and E the total key count.
- **Space Complexity:** O(n) for the visited flags and the stack.

## Implementation

```python
from typing import List
class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        seen = {0}
        stack = [0]
        while stack:
            u = stack.pop()
            for v in rooms[u]:
                if v not in seen:
                    seen.add(v)
                    stack.append(v)
        return len(seen) == len(rooms)
```
