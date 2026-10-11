## Approach

Measure the height `h`, then create an `h` by `2^h - 1` grid of empty strings. Fill it depth-first: a node covering columns `[L, R]` sits at `(L + R) // 2` on its row, and its children cover the left and right halves on the next row. Node values become strings.

## Complexity Analysis

- **Time Complexity:** O(h * 2^h) to create and fill the grid.
- **Space Complexity:** O(h * 2^h) for the canvas.

## Implementation

```python
from typing import List
class Solution:
    def printTree(self, root) -> List[List[str]]:
        def height(n):
            if not n:
                return 0
            return 1 + max(height(n.left), height(n.right))
        h = height(root)
        w = (1 << h) - 1
        ans = [["" for _ in range(w)] for _ in range(h)]
        def fill(n, r, l, rr):
            if not n:
                return
            c = (l + rr) // 2
            ans[r][c] = str(n.val)
            fill(n.left, r + 1, l, c - 1)
            fill(n.right, r + 1, c + 1, rr)
        fill(root, 0, 0, w - 1)
        return ans
```
