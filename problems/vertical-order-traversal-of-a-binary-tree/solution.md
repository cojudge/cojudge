## Approach

Walk the tree tracking each node's column and row (root at 0,0; left is column-1, right is column+1, both row+1). Store (column, row, value) triples for all nodes, sort them by column then row then value, and finally group consecutive triples with equal columns into the output lists. The sort directly implements the required ordering including the value tie-break.

## Complexity Analysis

- **Time Complexity:** O(n log n), where n is the node count, dominated by sorting the triples.
- **Space Complexity:** O(n) for the triple list and the grouped output.

## Implementation

```python
from typing import List
class Solution:
    def verticalTraversal(self, root) -> List[List[int]]:
        nodes = []
        def dfs(node, col, row):
            if not node:
                return
            nodes.append((col, row, node.val))
            dfs(node.left, col - 1, row + 1)
            dfs(node.right, col + 1, row + 1)
        dfs(root, 0, 0)
        nodes.sort()
        ans = []
        prev = None
        for c, r, v in nodes:
            if c != prev:
                ans.append([])
                prev = c
            ans[-1].append(v)
        return ans
```
