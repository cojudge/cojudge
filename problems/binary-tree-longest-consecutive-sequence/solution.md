## Approach

One DFS pass carries the length of the consecutive run ending at each node (extended when child == parent + 1, else restarted) and records the global maximum.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h)

## Implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def longestConsecutive(self, root) -> int:
        self.best = 0
        def dfs(node, parent_val, length):
            if not node:
                return
            cur = length + 1 if parent_val is not None and node.val == parent_val + 1 else 1
            self.best = max(self.best, cur)
            dfs(node.left, node.val, cur)
            dfs(node.right, node.val, cur)
        dfs(root, None, 0)
        return self.best
```
