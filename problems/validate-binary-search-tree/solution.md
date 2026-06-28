## Approach

Perform an inorder traversal — a BST must yield strictly increasing values. Use a stack to traverse iteratively and track the previous value.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h)

## Implementation

```python
from typing import Optional
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        stack = []
        cur = root
        prev = float('-inf')
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            if cur.val <= prev:
                return False
            prev = cur.val
            cur = cur.right
        return True
```
