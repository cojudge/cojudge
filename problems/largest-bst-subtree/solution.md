## Approach

Walk the tree bottom-up, with each call reporting whether its subtree is ordered, how large it is, and the smallest and largest values it contains. An empty child counts as ordered with an extreme range so comparisons succeed. A parent is ordered exactly when both children are ordered and its own value falls strictly between the left maximum and the right minimum; in that case its size and range extend the children's, and the global best is updated.

## Complexity Analysis

- **Time Complexity:** O(n), each node visited once.
- **Space Complexity:** O(h) recursion depth, O(n) worst case.

## Implementation

```python
class Solution:
    def largestBSTSubtree(self, root) -> int:
        self.best = 0
        def dfs(n):
            if not n:
                return (True, 0, float("inf"), float("-inf"))
            lb, lsz, llo, lhi = dfs(n.left)
            rb, rsz, rlo, rhi = dfs(n.right)
            if lb and rb and lhi < n.val < rlo:
                sz = lsz + rsz + 1
                if sz > self.best:
                    self.best = sz
                return (True, sz, min(n.val, llo), max(n.val, rhi))
            return (False, 0, 0, 0)
        dfs(root)
        return self.best
```
