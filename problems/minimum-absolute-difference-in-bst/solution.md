## Approach

An inorder traversal of a binary search tree lists its values from smallest to largest. In sorted order the closest pair of values must sit next to each other, so a single pass comparing every value with its predecessor finds the minimum gap. The walk remembers the previous value and the tightest difference observed.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def getMinimumDifference(self, root) -> int:
        self.best = float('inf')
        self.prev = None
        def inorder(node):
            if not node:
                return
            inorder(node.left)
            if self.prev is not None:
                self.best = min(self.best, node.val - self.prev)
            self.prev = node.val
            inorder(node.right)
        inorder(root)
        return self.best
```
