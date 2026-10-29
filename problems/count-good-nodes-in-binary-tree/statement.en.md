You are given the root of a binary tree. Regard a node as **good** when its value reaches or exceeds every value encountered along the route from the root down to it.

Count how many such good nodes the tree holds. The route examined for each node contains both endpoints, the root and the node itself.

**Constraints:**
- The number of nodes lies in the range `1` to `100000`.
- `-10^4 <= node.val <= 10^4`
