## Approach

For each node in the root tree, check whether the subtree rooted at that node matches the subRoot using a same-tree comparison. Recurse left and right if no match is found.

## Complexity Analysis

- **Time Complexity:** O(m×n)
- **Space Complexity:** O(h)

## Implementation

```python
from typing import Optional
class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        if not subRoot:
            return True
        if not root:
            return False
        if self.isSame(root, subRoot):
            return True
        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)
    def isSame(self, a, b):
        if not a and not b:
            return True
        if not a or not b or a.val != b.val:
            return False
        return self.isSame(a.left, b.left) and self.isSame(a.right, b.right)
```
