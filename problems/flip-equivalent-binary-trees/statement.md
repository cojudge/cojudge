Test whether two binary trees can be made identical by swapping child pairs.

One flip picks any node and exchanges its left and right subtrees. Applying flips anywhere, any number of times, reshapes a tree without changing its values.

Given the roots `root1` and `root2`, return `true` when the first tree can be turned into the second through flips, else `false`. An empty tree is written `[]`.

**Constraints:**
- Each tree holds between 0 and 100 nodes.
- Node values lie in `0..99` and are unique within a tree.
