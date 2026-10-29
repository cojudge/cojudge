You are given the root of a binary tree in level-order form. Among all nodes, look at those sitting at the greatest depth (the longest root-to-leaf distance).

Find the smallest subtree that holds every such deepest node. Return the root of that subtree, again encoded in level-order form.

Intuitively, walk down until the branches holding the deepest leaves finally meet; that meeting point is the answer.

**Constraints:**
- The tree holds `1 <= n <= 500` nodes.
- `0 <= node.val <= 500`
- All values are unique.
