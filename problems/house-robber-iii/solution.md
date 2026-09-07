## Approach

Tree DP: for each node return `(rob, skip)`. Robbing the node means adding its value to the skip results of children. Skipping means taking the max of each child's rob/skip.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(h)

## Implementation

```python
class Solution:
    def rob(self, root) -> int:
        def dfs(n):
            if not n:
                return (0, 0)
            lr, ls = dfs(n.left)
            rr, rs = dfs(n.right)
            rob = n.val + ls + rs
            skip = max(lr, ls) + max(rr, rs)
            return (rob, skip)
        return max(dfs(root))
```
