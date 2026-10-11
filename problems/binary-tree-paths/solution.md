## Approach

Do a depth-first walk carrying the path string built from the root to the current node. When a leaf is reached, store a copy of the accumulated path. Otherwise extend the path with `"->"` plus the child value and recurse into each existing child, backtracking afterward so sibling branches start from the right prefix.

## Complexity Analysis

- **Time Complexity:** O(n * h), where n is the number of nodes and h is the tree height, for building each root-to-leaf string.
- **Space Complexity:** O(h) recursion depth plus the output.

## Implementation

```python
class Solution:
    def binaryTreePaths(self, root) -> list[str]:
        res: list[str] = []
        def dfs(node, path: str) -> None:
            if node is None:
                return
            cur = f"{path}->{node.val}" if path else str(node.val)
            if node.left is None and node.right is None:
                res.append(cur)
            else:
                dfs(node.left, cur)
                dfs(node.right, cur)
        dfs(root, "")
        return res
```
