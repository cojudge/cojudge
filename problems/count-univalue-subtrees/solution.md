## Approach

Use a post-order walk that reports whether each subtree is univalue. A null child is trivially univalue. A node qualifies when both children qualify and any present child matches its value; each qualifying node increments the total. The walk returns the qualification flag upward so parents can decide.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def countUnivalSubtrees(self, root) -> int:
        self.count = 0

        def is_unival(node):
            if node is None:
                return True
            left = is_unival(node.left)
            right = is_unival(node.right)
            if not left or not right:
                return False
            if node.left and node.left.val != node.val:
                return False
            if node.right and node.right.val != node.val:
                return False
            self.count += 1
            return True

        is_unival(root)
        return self.count
```
