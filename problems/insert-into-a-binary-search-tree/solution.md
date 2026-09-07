## Approach

Walk from the root: go left if `val` is smaller, right if larger, until a null child is found, then attach the new node.

## Complexity Analysis

- **Time Complexity:** O(h)
- **Space Complexity:** O(h) recursion

## Implementation

```python
class Solution:
    def insertIntoBST(self, root, val: int):
        if root is None:
            return TreeNode(val)
        if val < root.val:
            root.left = self.insertIntoBST(root.left, val)
        else:
            root.right = self.insertIntoBST(root.right, val)
        return root
```
