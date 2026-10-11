## Approach

Recurse post-order: first prune the left and right children, then look at the current node. If it stores 0 and both pruned children are null, the whole subtree is zero-only and the node is dropped by returning null. Otherwise the (possibly updated) node is returned. This keeps exactly the subtrees that contain a 1.

## Complexity Analysis

- **Time Complexity:** O(n) for n nodes, each visited once.
- **Space Complexity:** O(h) recursion depth for height h.

## Implementation

```python
class Solution:
    def pruneTree(self, root):
        if root is None:
            return None
        root.left = self.pruneTree(root.left)
        root.right = self.pruneTree(root.right)
        if root.val == 0 and root.left is None and root.right is None:
            return None
        return root
```
