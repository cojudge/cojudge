You are given the root of a binary tree. Build a compact text form of the tree by visiting nodes in root-first order (node, then left part, then right part).

Rules for each visited node with value `v`, left rendering `L` and right rendering `R`:

- When the node has no children, write just `v`.
- When only a left child exists, write `v(L)`.
- When both children exist, write `v(L)(R)`.
- When the left child is absent but the right child is present, write `v()(R)` so the empty left slot is still visible. A missing right child with no right content contributes nothing.

Apply the same rules recursively to every subtree and return the full string for the whole tree. An empty tree yields an empty string.

**Constraints:**
- The tree holds between 0 and 10000 nodes.
- Each node value lies between -1000 and 1000.
