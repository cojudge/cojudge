Two entries of a binary search tree have had their values exchanged by accident. Restore the tree so it satisfies the search-tree ordering again, without altering its shape.

In a valid search tree, every node's left descendants hold smaller values and right descendants hold larger values. Equivalently, an inorder walk visits values in strictly ascending order. Exactly two nodes violate this order; find them and swap their values back.

Return the root of the repaired tree.

**Constraints:**
- `2 <= number of nodes <= 1000`
- `-2^31 <= Node.val <= 2^31 - 1`
- The input tree is guaranteed to become a valid search tree after swapping exactly two node values.

**Adaptation note:** The classic formulation modifies the tree in place with no return value. This version returns the repaired `TreeNode` root so outputs can be serialized and checked.
