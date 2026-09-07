## Approach

Do a depth-first traversal that visits the current node first, then the left subtree, then the right subtree. Collect values in a list as you visit. This can be written recursively or with an explicit stack that processes the root before pushing right then left children.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack (O(n) worst case), plus O(n) for the output.

## Implementation

```python
from typing import List
class Solution:
    def preorderTraversal(self, root) -> List[int]:
        out = []
        def dfs(node):
            if node is None:
                return
            out.append(node.val)
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return out
```
