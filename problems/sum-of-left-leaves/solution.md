## Approach

Depth-first search carries one extra flag telling whether the current node arrived as a left child. An empty child contributes nothing; a leaf contributes its value only when the flag is set; an inner node sums both sides with updated flags. Starting the walk at the root with the flag cleared counts exactly the left leaves.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count.
- **Space Complexity:** O(h) recursion depth, O(n) worst case.

## Implementation

```python
class Solution:
    def sumOfLeftLeaves(self, root) -> int:
        def dfs(node, is_left: bool) -> int:
            if node is None:
                return 0
            if node.left is None and node.right is None:
                return node.val if is_left else 0
            return dfs(node.left, True) + dfs(node.right, False)
        return dfs(root, False)
```
