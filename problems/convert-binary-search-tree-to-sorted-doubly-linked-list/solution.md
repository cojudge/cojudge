## Approach

Gather the BST values with an inorder traversal, which emits them in ascending order. Then stitch a fresh right-leaning chain from those values, leaving every left pointer empty. The head of that chain is the answer in this linearized adaptation.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the node count. One inorder pass plus one chaining pass.
- **Space Complexity:** O(n) for the value list and the rebuilt chain.

## Implementation

```python
class Solution:
    def treeToDoublyList(self, root):
        vals = []
        def inorder(n):
            if not n:
                return
            inorder(n.left)
            vals.append(n.val)
            inorder(n.right)
        inorder(root)
        if not vals:
            return None
        head = TreeNode(vals[0])
        cur = head
        for v in vals[1:]:
            cur.right = TreeNode(v)
            cur = cur.right
        return head
```
