## Approach
Recursive DFS: the maximum depth of a node is 1 plus the maximum depth of its left and right children. Return 0 for a null node.

## Complexity Analysis
- **Time Complexity:** O(n)
- **Space Complexity:** O(h)

## Implementation
```python
from typing import Optional
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```
