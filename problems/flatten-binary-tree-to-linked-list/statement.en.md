Reshape a binary tree into a right-leaning chain that follows preorder visiting order.

After flattening, every node's left pointer must be empty and each right pointer must lead to the next node in a preorder walk (root, then left subtree, then right subtree). The node values stay the same; only the links change.

Return the root of the reshaped tree.

**Constraints:**
- `0 <= number of nodes <= 2000`
- `-100 <= Node.val <= 100`

**Adaptation note:** The classic task rewrites the tree in place and returns nothing. This version returns the flattened root so the result can be serialized and graded.
