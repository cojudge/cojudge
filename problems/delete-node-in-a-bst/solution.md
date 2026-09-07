## Approach

Search for the key. If the node has one child, replace it with that child. If it has two, replace its value with the inorder successor (minimum of the right subtree) and delete the successor.

## Complexity Analysis

- **Time Complexity:** O(h)
- **Space Complexity:** O(h)

## Implementation

```python
class Solution:
    def deleteNode(self, root, key: int):
        if not root:
            return None
        if key < root.val:
            root.left = self.deleteNode(root.left, key)
        elif key > root.val:
            root.right = self.deleteNode(root.right, key)
        else:
            if not root.left:
                return root.right
            if not root.right:
                return root.left
            succ = root.right
            while succ.left:
                succ = succ.left
            root.val = succ.val
            root.right = self.deleteNode(root.right, succ.val)
        return root
```
