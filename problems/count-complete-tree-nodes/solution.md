## Approach

Measure the leftmost depth and the rightmost depth of each subtree. When they agree, the subtree is a perfect tree with `2^h - 1` nodes and needs no further visits. Otherwise the last level is only partly filled, so count the root plus both sides recursively. Completeness guarantees one side becomes perfect at every step, keeping the walk short.

## Complexity Analysis

- **Time Complexity:** O(log^2 n), one height walk per level of recursion.
- **Space Complexity:** O(log n) for the recursion stack.

## Implementation

```python
class Solution:
    def countNodes(self, root) -> int:
        if root is None:
            return 0

        def height(node, go_left: bool) -> int:
            h = 0
            while node is not None:
                h += 1
                node = node.left if go_left else node.right
            return h

        left_h = height(root, True)
        right_h = height(root, False)
        if left_h == right_h:
            return (1 << left_h) - 1
        return 1 + self.countNodes(root.left) + self.countNodes(root.right)
```
