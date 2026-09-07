## Approach

Recursively visit the left subtree, then the right subtree, then the root.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h) recursion stack

## Implementation

```python
from typing import List
class Solution:
    def postorderTraversal(self, root) -> List[int]:
        res = []
        def go(node):
            if not node:
                return
            go(node.left)
            go(node.right)
            res.append(node.val)
        go(root)
        return res
```
