## Approach

The head of the preorder list is always the current root. The next preorder value opens the left subtree, and its position in the postorder list marks exactly where that left subtree ends — everything before it (within the current span) belongs to the left child, and the remainder before the closing root belongs to the right child. Recursing on both spans rebuilds the whole tree; a lone child can go on either side, and any placement reproducing both traversals is accepted.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is created once with O(1) index lookups.
- **Space Complexity:** O(n) for the index map plus O(n) recursion depth in the worst case.

## Implementation

```python
class Solution:
    def constructFromPrePost(self, preorder, postorder):
        post_idx = {v: i for i, v in enumerate(postorder)}
        self.pos = 0

        def build(l, r):
            if l > r:
                return None
            root = TreeNode(preorder[self.pos])
            self.pos += 1
            if l == r:
                return root
            m = post_idx[preorder[self.pos]]
            root.left = build(l, m)
            root.right = build(m + 1, r - 1)
            return root

        return build(0, len(postorder) - 1)
```
