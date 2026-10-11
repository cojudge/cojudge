## Approach

Do a left-first depth walk of each tree, recording a value whenever a node has no children. The two recorded lists are the leaf sequences; equality of the lists decides the answer.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are the sizes of the two trees.
- **Space Complexity:** O(n + m) for the leaf lists plus O(h) recursion depth.

## Implementation

```python
class Solution:
    def leafSimilar(self, root1, root2) -> bool:
        def leaves(n):
            if not n:
                return []
            if not n.left and not n.right:
                return [n.val]
            return leaves(n.left) + leaves(n.right)
        return leaves(root1) == leaves(root2)
```
