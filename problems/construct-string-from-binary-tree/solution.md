## Approach

Do a preorder walk that writes the node value first. Whenever a node owns at least one child, wrap the left rendering in parentheses; whenever a right child exists, wrap the right rendering too. The only subtle case is a missing left child paired with a present right child, where an empty pair preserves the structure. A shared recursive helper carrying a string buffer keeps every value conversion in one place.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count. Each node is visited once.
- **Space Complexity:** O(n) for the output plus recursion depth (worst case O(n) on a chain, O(log n) on a balanced tree).

## Implementation

```python
class Solution:
    def tree2str(self, root) -> str:
        parts = []
        def build(t):
            if t is None:
                return
            parts.append(str(t.val))
            if t.left is not None or t.right is not None:
                parts.append("(")
                build(t.left)
                parts.append(")")
            if t.right is not None:
                parts.append("(")
                build(t.right)
                parts.append(")")
        build(root)
        return "".join(parts)
```
