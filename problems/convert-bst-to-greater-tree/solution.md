## Approach

A reversed inorder walk (right subtree, node, left subtree) visits BST keys from largest to smallest. A running accumulator adds each node's original value and then replaces the node's value with the accumulator, so every node ends up holding its own key plus all greater keys. The tree structure is left untouched.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of nodes. Each node is visited once.
- **Space Complexity:** O(h) for the recursion stack, where h is the tree height.

## Implementation

```python
class Solution:
    def convertBST(self, root):
        self.acc = 0
        def walk(node):
            if not node:
                return
            walk(node.right)
            self.acc += node.val
            node.val = self.acc
            walk(node.left)
        walk(root)
        return root
```
