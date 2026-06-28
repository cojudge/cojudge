## Approach

Perform an iterative inorder traversal of the BST using a stack. Since inorder traversal visits nodes in sorted order, the kth visited node is the kth smallest element.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes in the tree.
- **Space Complexity:** O(h), where h is the height of the tree (stack size).

## Implementation

```python
from typing import Optional
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        stack = []
        cur = root
        while cur or stack:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right
```
