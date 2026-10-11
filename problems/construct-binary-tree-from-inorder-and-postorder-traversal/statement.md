Rebuild a binary tree when you are given its inorder and postorder visit orders.

The inorder walk lists each subtree as left, root, right. The postorder walk lists each subtree as left, right, root — so the last postorder entry is the overall root. Find that root value inside the inorder list: entries to its left belong to the left subtree and entries to its right belong to the right subtree. Apply the same reasoning recursively to each side.

All values are unique, and both lists describe the same tree. Return its root.

**Constraints:**
- `1 <= inorder.length <= 3000`
- `postorder.length == inorder.length`
- `-3000 <= inorder[i], postorder[i] <= 3000`
- Both lists contain distinct values, and every postorder value appears in inorder.
