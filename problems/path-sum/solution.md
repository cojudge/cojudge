## Approach

Depth-first search carries the remaining sum downward. Each call subtracts the current value; at a leaf the call succeeds exactly when nothing remains. Non-leaf nodes combine their children's answers with logical OR, and a null tree immediately fails. Negative values are handled naturally since no early pruning is used.

## Complexity Analysis

- **Time Complexity:** O(n), each node visited once.
- **Space Complexity:** O(h) recursion depth.

## Implementation

```python
class Solution:
    def hasPathSum(self, root, targetSum: int) -> bool:
        if not root:
            return False
        if not root.left and not root.right:
            return root.val == targetSum
        rest = targetSum - root.val
        return self.hasPathSum(root.left, rest) or self.hasPathSum(root.right, rest)
```
