## Approach

The first element of preorder is the root; find its index in inorder to split left and right subtrees recursively.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List, Optional
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        idx_map = {v: i for i, v in enumerate(inorder)}
        self.pre_idx = 0
        def build(l, r):
            if l > r:
                return None
            val = preorder[self.pre_idx]
            self.pre_idx += 1
            node = TreeNode(val)
            mid = idx_map[val]
            node.left = build(l, mid - 1)
            node.right = build(mid + 1, r)
            return node
        return build(0, len(inorder) - 1)
```
