Decide whether a binary tree reads the same on both sides — that is, whether it is a mirror image of itself around its center.

Two trees are mirrors when their roots hold equal values and each left branch of one matches the corresponding right branch of the other, recursively. Check the root's left subtree against its right subtree in this mirrored fashion.

Return `true` when the whole structure is mirrored, otherwise `false`.

**Constraints:**
- `0 <= number of nodes <= 1000`
- `-100 <= Node.val <= 100`
