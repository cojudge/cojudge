In a binary tree, two nodes are cousins when they sit at the same depth but have
different parents. The root is at depth 0, its children at depth 1, and so on.
Each value in the tree appears exactly once.

Given the `root` of a binary tree and two distinct values `x` and `y`, return
`true` if the nodes holding `x` and `y` are cousins, and `false` otherwise.

**Constraints:**
- The number of nodes is between `2` and `100`.
- `1 <= Node.val <= 100`
- All node values are distinct.
- `x != y` and both values occur in the tree.
