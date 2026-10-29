You are given the root of a binary tree whose nodes hold only `0` or `1`. Remove every subtree that contains no `1` anywhere inside it.

Concretely, process the tree from the leaves upward: if a node's entire subtree (itself plus all descendants) holds only zeros, delete that subtree. A node with value `1` always survives, and a zero node survives only when at least one descendant kept for the same reason exists.

Return the root of the trimmed tree, or null when nothing remains.

**Constraints:**
- The tree has at most 200 nodes.
- Each node value is `0` or `1`.
