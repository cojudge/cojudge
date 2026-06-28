## Approach

Recursively compare both trees: if both nodes are null they match; if one is null or values differ they don't; otherwise recurse on left and right children.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h)

## Implementation

```python
from typing import Optional
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        if not p and not q:
            return True
        if not p or not q or p.val != q.val:
            return False
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```
