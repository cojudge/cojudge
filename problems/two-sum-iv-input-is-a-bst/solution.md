## Approach

Walk the tree in any order while keeping every visited value in a hash set. For the current node holding `v`, a partner exists exactly when `k - v` was seen before. Insert `v` after the check so a node never pairs with itself.

## Complexity Analysis

- **Time Complexity:** O(n) for one visit per node with O(1) set work.
- **Space Complexity:** O(n) for the set of values.

## Implementation

```python
class Solution:
    def findTarget(self, root, k: int) -> bool:
        seen = set()
        stack = [root] if root else []
        while stack:
            n = stack.pop()
            if k - n.val in seen:
                return True
            seen.add(n.val)
            if n.left:
                stack.append(n.left)
            if n.right:
                stack.append(n.right)
        return False
```
