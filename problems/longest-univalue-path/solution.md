## Approach

Walk the tree from the bottom up. For every node, ask each child for the longest equal-valued arm reaching upward from that child. Keep the arm only when the child carries the same value as the parent (adding one edge); otherwise the arm resets to zero. The best route passing through the current node joins the left and right arms, and a shared maximum over all nodes becomes the answer. The value returned upward is the longer of the two arms.

## Complexity Analysis

- **Time Complexity:** O(n), each node is visited once.
- **Space Complexity:** O(h) recursion depth, where h is the tree height.

## Implementation

```python
class Solution:
    def longestUnivaluePath(self, root) -> int:
        self.best = 0
        def dfs(node):
            if not node:
                return 0
            left = dfs(node.left)
            right = dfs(node.right)
            left_arm = left + 1 if node.left and node.left.val == node.val else 0
            right_arm = right + 1 if node.right and node.right.val == node.val else 0
            self.best = max(self.best, left_arm + right_arm)
            return max(left_arm, right_arm)
        dfs(root)
        return self.best
```
