In a binary search tree, find the inorder successor of the node with value `p`.

**Adaptation:** instead of node references, `p` is given as an integer value
present in the tree and you return the successor's value, or `-1` when `p`
is the maximum (the original would return null). Implement
`inorderSuccessor(root, p)`.

**Constraints:**
- `1 <= nodes <= 10^4`
- Tree is a valid BST; `p` exists in the tree.
