Two integer arrays `preorder` and `inorder` capture traversals of a common binary tree: `preorder` lists vertices in root-left-right order, while `inorder` lists them in left-root-right order.
Rebuild the underlying tree and hand back its root.

**Constraints:**

- 1 ≤ preorder.length ≤ 3000
- inorder.length == preorder.length
- -3000 ≤ preorder[i], inorder[i] ≤ 3000
- preorder and inorder consist of unique values.
- Each value of inorder also appears in preorder.
- preorder is guaranteed to be the preorder traversal of the tree.
- inorder is guaranteed to be the inorder traversal of the tree.
