Given the root of a binary tree, find the longest route in which every visited node carries the same value. The route may go through a node and extend into both its left and right sides, or it may lie entirely inside one subtree; it does not have to include the root.

Count the route by edges (the number of links between nodes), not by nodes. A single node alone therefore scores `0`, and an empty tree also scores `0`.

**Constraints:**
- The tree holds between `0` and `10^4` nodes.
- `-1000 <= Node.val <= 1000`
- The depth never exceeds `1000`.
