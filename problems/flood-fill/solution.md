## Approach

Snapshot the color of the start cell. If it already matches the target, there is nothing to do. Otherwise run an explicit stack (depth-first search) from the start: pop a cell, paint its four orthogonal neighbours when they still hold the old color, and push them. Painting on discovery guarantees each cell is handled once.

## Complexity Analysis

- **Time Complexity:** O(m * n) for an m-by-n picture, each cell visited at most once.
- **Space Complexity:** O(m * n) worst case for the stack.

## Implementation

```python
from typing import List
class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        old = image[sr][sc]
        if old == color:
            return image
        m, n = len(image), len(image[0])
        stack = [(sr, sc)]
        image[sr][sc] = color
        while stack:
            r, c = stack.pop()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and image[nr][nc] == old:
                    image[nr][nc] = color
                    stack.append((nr, nc))
        return image
```
