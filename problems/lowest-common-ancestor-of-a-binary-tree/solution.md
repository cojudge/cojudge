## Approach

Search the tree recursively for either target value. A null subtree reports nothing, and a node holding `p` or `q` reports itself. When both the left and right subtrees report a hit, the current node is the lowest node covering both targets. Otherwise pass up whichever single hit exists.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def lowestCommonAncestor(self, root, p: int, q: int):
        if root is None or root.val == p or root.val == q:
            return root
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        if left and right:
            return root
        return left if left else right
```
