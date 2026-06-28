## Approach

DFS post-order traversal where each node returns the max gain of a path ending at that node, while tracking the best path sum that goes through any node.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h) where h is tree height

## Implementation

```python
from typing import Optional
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        res = float('-inf')
        def dfs(node):
            nonlocal res
            if not node:
                return 0
            left = max(dfs(node.left), 0)
            right = max(dfs(node.right), 0)
            res = max(res, left + right + node.val)
            return node.val + max(left, right)
        dfs(root)
        return res
```
