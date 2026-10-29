You are given the root of a binary search tree (BST). Rewrite the tree so that every node's value becomes the sum of its original value plus all values greater than it (keeping the same shape). In other words, each node accumulates the total of its own key and every larger key in the tree.

Return the root of the rewritten tree.

**Constraints:**
- The tree holds between 0 and 10^4 nodes.
- `-10^4 <= Node.val <= 10^4`
- The tree is a valid BST with distinct values.
- The rewritten values fit in a 32-bit signed integer.
