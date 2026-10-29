Given the root of a binary tree and two distinct values `p` and `q` that both occur in the tree, find their lowest common ancestor.

The lowest common ancestor of two nodes is the deepest node that has both of them in its subtree, where a node counts as being in its own subtree. All node values in the tree are unique.

Return the ancestor node itself (as a tree).

*Adaptation note:* the original statement passes the two target nodes as node references. Here they are passed as integer values `p` and `q` instead, since every value is unique; the returned tree is the subtree rooted at the ancestor.

**Constraints:**
- The number of nodes is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All node values are unique.
- `p != q`, and both values exist in the tree.
