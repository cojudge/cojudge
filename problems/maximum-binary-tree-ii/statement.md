A maximum binary tree is built from an array by a simple rule: the largest
value becomes the root, the same rule applied to the part left of it builds
the left subtree, and the same rule applied to the part right of it builds the
right subtree.

You are given the `root` of such a tree (constructed from some array `a`) and
a new integer `val` that is appended to `a`. Rebuild the tree for the extended
array, returning its new root. The original tree must be reused rather than
reconstructed from scratch: the change only affects nodes along one path.

**Constraints:**
- The number of nodes is between `1` and `100`.
- `1 <= Node.val <= 100`
- All node values are distinct.
- `1 <= val <= 100`
