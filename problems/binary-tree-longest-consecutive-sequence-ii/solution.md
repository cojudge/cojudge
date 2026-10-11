## Approach

Post-order DFS returns two numbers per node: the longest increasing consecutive chain and the longest decreasing chain beginning at that node. Each child can extend one of them when its value is exactly one more or one less. The best trail passing through the node joins both arms minus the double-counted node.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h) recursion depth.

## Implementation

```python
class Solution:
    def longestConsecutive(self, root) -> int:
        self.best = 0
        def dfs(node):
            if not node:
                return (0, 0)
            inc = dec = 1
            if node.left:
                li, ld = dfs(node.left)
                if node.left.val == node.val + 1:
                    inc = max(inc, li + 1)
                if node.left.val == node.val - 1:
                    dec = max(dec, ld + 1)
            if node.right:
                ri, rd = dfs(node.right)
                if node.right.val == node.val + 1:
                    inc = max(inc, ri + 1)
                if node.right.val == node.val - 1:
                    dec = max(dec, rd + 1)
            self.best = max(self.best, inc + dec - 1)
            return (inc, dec)
        dfs(root)
        return self.best
```
