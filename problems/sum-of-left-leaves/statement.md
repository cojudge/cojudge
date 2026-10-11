You receive the root of a binary tree. Add up the values of certain special nodes: those that are leaves and sit as the left child of their parent.

A leaf means a node with neither a left nor a right child. The root itself never counts, because it has no parent. Any leaf reached via a right edge is ignored.

Return the total of all qualifying left-leaf values.

**Constraints:**
- `1 <= number of nodes <= 1000`
- `-1000 <= Node.val <= 1000`
