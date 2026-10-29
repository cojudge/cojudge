Find how short the shortest root-to-leaf chain in a binary tree can be.

A leaf is a node with neither a left nor a right child. Count nodes along the path, so a lone root has depth 1 and an empty tree has depth 0. Where a node has only one child, the path must continue through that child — a missing side does not count as depth 0.

**Constraints:**
- `0 <= number of nodes <= 10^5`
- `-1000 <= Node.val <= 1000`
