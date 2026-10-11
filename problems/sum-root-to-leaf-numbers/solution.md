## Approach

Do a depth-first walk that carries the number formed so far. Entering a child multiplies the prefix by ten and adds the child's digit; reaching a leaf returns the completed number, while internal nodes return the sum of both subtrees.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def sumNumbers(self, root) -> int:
        def dfs(node, cur):
            if not node:
                return 0
            v = cur * 10 + node.val
            if not node.left and not node.right:
                return v
            return dfs(node.left, v) + dfs(node.right, v)
        return dfs(root, 0)
```
