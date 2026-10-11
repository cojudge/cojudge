## Approach

Compare the two trees recursively. Empty pairs match, half-empty pairs fail, and differing root values fail. Otherwise the answer is true when either the straight pairing (left with left, right with right) or the crossed pairing (left with right, right with left) fully matches, which models using or skipping a flip at the current node.

## Complexity Analysis

- **Time Complexity:** O(n) in practice for these sizes; each node pair is examined a small number of times.
- **Space Complexity:** O(h) call stack for trees of height h.

## Implementation

```python
class Solution:
    def flipEquiv(self, root1, root2) -> bool:
        if root1 is None and root2 is None:
            return True
        if root1 is None or root2 is None:
            return False
        if root1.val != root2.val:
            return False
        straight = self.flipEquiv(root1.left, root2.left) and self.flipEquiv(root1.right, root2.right)
        crossed = self.flipEquiv(root1.left, root2.right) and self.flipEquiv(root1.right, root2.left)
        return straight or crossed
```
