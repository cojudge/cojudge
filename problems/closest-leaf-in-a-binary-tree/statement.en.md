You are given the root of a binary tree in which every node holds a distinct integer, plus a target value `k` that appears somewhere in the tree.

A leaf is a node with no children at all. You may travel along parent-child links in either direction, and the length of a route is the number of edges used.

Return the value stored in a leaf that is as close as possible to the node holding `k`. When several leaves tie for the shortest distance, any one of them is accepted.

**Constraints:**
- `1 <= number of nodes <= 1000`
- `1 <= Node.val <= 1000`
- Every value in the tree is unique.
- Some node holds the value `k`.
