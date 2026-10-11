## Approach

Walk the search tree in order so values appear sorted from small to large.
Remember the previously visited value and compare it with the current one;
their gap is a candidate for the answer. The smallest candidate across the
whole walk is the result, because any closest pair in value must be adjacent
in sorted order.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def minDiffInBST(self, root) -> int:
        self.best = float("inf")
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
        return int(self.best)
```
