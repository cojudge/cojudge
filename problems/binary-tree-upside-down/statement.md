You are given the root of a binary tree in which every node either has no right child or its right child is a leaf, and every left child (when present) is an internal node with its own children. Turn the whole tree upside down and return the new root.

Rewiring follows one rule applied bottom-up along the left spine: for each node `p` with left child `l` and right child `r`, after the flip `l` takes `p`'s position, with `l.left = r` and `l.right = p`. The original root becomes a leaf.

**Constraints:**
- The tree holds between 0 and 1000 nodes.
- `0 <= Node.val <= 100`
- The input always satisfies the structural rule above (right children are leaves or absent).
