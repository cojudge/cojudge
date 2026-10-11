## Approach

The tail of the postorder list is the root. A hash map from value to inorder position splits the inorder range into left and right parts in constant time. Because postorder is consumed backwards (root, then right, then left), the recursion builds the right subtree first and then the left one, each step shrinking both ranges until they are empty.

## Complexity Analysis

- **Time Complexity:** O(n) with the index map; each node is created once.
- **Space Complexity:** O(n) for the map plus O(h) recursion depth.

## Implementation

```python
from typing import List
class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]):
        pos = {v: i for i, v in enumerate(inorder)}
        self.pi = len(postorder) - 1
        def helper(l, r):
            if l > r:
                return None
            rv = postorder[self.pi]
            self.pi -= 1
            root = TreeNode(rv)
            m = pos[rv]
            root.right = helper(m + 1, r)
            root.left = helper(l, m - 1)
            return root
        return helper(0, len(inorder) - 1)
```
