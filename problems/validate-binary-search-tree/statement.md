You are handed the `root` of a binary tree. Report whether the tree honors binary-search-tree ordering everywhere: for every node, each value in its entire left descendant group must lie strictly below the node's own value, each value in its entire right descendant group must lie strictly above it, and the left and right child groups must each independently satisfy this same ordering.

**Constraints:**

- The number of nodes in the tree is in the range [1, 10^4].
- -2^31 ≤ Node.val ≤ 2^31 - 1
