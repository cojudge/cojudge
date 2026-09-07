## Approach

Do a depth-first traversal that visits the left subtree first, then the current node, then the right subtree. Collect values in a list as you visit. This can be written recursively or with an explicit stack that pushes left children before processing each node.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack (O(n) worst case), plus O(n) for the output.

## Implementation

```python
from typing import List
class Solution:
    def inorderTraversal(self, root) -> List[int]:
        out = []
        def dfs(node):
            if node is None:
                return
            dfs(node.left)
            out.append(node.val)
            dfs(node.right)
        dfs(root)
        return out
```
