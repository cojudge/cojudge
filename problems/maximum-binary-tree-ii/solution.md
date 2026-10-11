## Approach

Appending `val` to the underlying array only affects the rightmost path of
the tree, because every element left of the old maximum keeps its relative
position. Compare `val` with the current node: if it is larger, the current
subtree becomes the left child of a fresh node holding `val`. Otherwise the
current node stays on top and the same step repeats on its right child, with
an empty right child simply receiving the new leaf.

## Complexity Analysis

- **Time Complexity:** O(h), where h is the height of the tree (at most n). Only the right spine is walked.
- **Space Complexity:** O(h) for the recursion stack.

## Implementation

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
class Solution:
    def insertIntoMaxTree(self, root, val: int):
        if root is None:
            return TreeNode(val)
        if val > root.val:
            return TreeNode(val, root, None)
        root.right = self.insertIntoMaxTree(root.right, val)
        return root
```
