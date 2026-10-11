## Approach

Mirror-check the two halves of the tree. A helper receives a pair of nodes that should be reflections of each other: both empty means success, exactly one empty means failure, and otherwise their values must match with cross-paired children (left-left against right-right and left-right against right-left). Starting the helper on the root's children determines symmetry.

## Complexity Analysis

- **Time Complexity:** O(n), every node is visited once.
- **Space Complexity:** O(h) recursion depth, O(n) in the worst skewed case.

## Implementation

```python
class Solution:
    def isSymmetric(self, root) -> bool:
        def mirror(a, b):
            if not a and not b:
                return True
            if not a or not b:
                return False
            return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
        if not root:
            return True
        return mirror(root.left, root.right)
```
