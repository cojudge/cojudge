## Approach
Leverage the BST property: if both nodes have values less than the root, the LCA lies in the left subtree. If both are greater, it lies in the right subtree. Otherwise, the current root is the LCA (one node is on each side, or root equals one of them).

## Complexity Analysis
- **Time Complexity:** O(h)
- **Space Complexity:** O(1)

## Implementation
```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        while root:
            if p.val < root.val and q.val < root.val:
                root = root.left
            elif p.val > root.val and q.val > root.val:
                root = root.right
            else:
                return root
```
