## Approach

Run a post-order traversal that returns the sum of each subtree. At every node, the absolute gap between the left and right sums is that node's tilt and is added to a running total; the node then reports its own value plus both subtree sums upward. One walk therefore collects every tilt and every sum together.

## Complexity Analysis

- **Time Complexity:** O(n) for n nodes, each visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def findTilt(self, root) -> int:
        self.total = 0
        def dfs(n):
            if n is None:
                return 0
            l = dfs(n.left)
            r = dfs(n.right)
            self.total += abs(l - r)
            return n.val + l + r
        dfs(root)
        return self.total
```
