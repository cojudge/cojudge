## Approach

Recurse on depth: an empty tree contributes 0 and a leaf contributes 1. If exactly one child exists, the answer is one plus the depth of that child (ignoring the missing side). With both children present, take one plus the smaller of the two depths. This avoids the classic mistake of treating a missing child as depth 0.

## Complexity Analysis

- **Time Complexity:** O(n), each node visited once.
- **Space Complexity:** O(h) recursion depth.

## Implementation

```python
class Solution:
    def minDepth(self, root) -> int:
        if not root:
            return 0
        if not root.left and not root.right:
            return 1
        if not root.left:
            return 1 + self.minDepth(root.right)
        if not root.right:
            return 1 + self.minDepth(root.left)
        return 1 + min(self.minDepth(root.left), self.minDepth(root.right))
```
