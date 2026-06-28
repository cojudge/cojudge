## Approach

Recursively traverse the tree swapping the left and right children of each node. A null node returns null as the base case.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes in the tree.
- **Space Complexity:** O(h), where h is the height of the tree (recursion stack depth).

## Implementation

```python
from typing import Optional
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root
```
