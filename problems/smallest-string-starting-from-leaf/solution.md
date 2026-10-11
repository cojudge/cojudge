## Approach

Do a depth-first walk carrying the root-to-leaf letters seen so far. At each leaf, reverse the accumulated path to obtain the leaf-to-root spelling and keep the smallest across leaves via lexicographic comparison. Backtracking restores the path for sibling subtrees.

## Complexity Analysis

- **Time Complexity:** O(n * h), where n is the node count and h is the height, due to reversing leaf paths.
- **Space Complexity:** O(h) for recursion and the current path.

## Implementation

```python
class Solution:
    def smallestFromLeaf(self, root) -> str:
        self.best = None
        path = []
        def dfs(node):
            if not node:
                return
            path.append(chr(ord('a') + node.val))
            if not node.left and not node.right:
                cand = ''.join(reversed(path))
                if self.best is None or cand < self.best:
                    self.best = cand
            else:
                dfs(node.left)
                dfs(node.right)
            path.pop()
        dfs(root)
        return self.best or ''
```
