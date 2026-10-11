You receive the `root` of a binary search tree (BST) along with an integer `val` that must be added to the structure. Produce the `root` of the tree once the addition is done. The incoming value is guaranteed absent from the starting tree.

Several placements can preserve BST ordering; returning any tree that is a valid BST containing all old values plus the new one is acceptable.

**Constraints:**
- The number of nodes in the tree is in the range `[0, 10^4]`
- `-10^8 <= Node.val <= 10^8`
- All the values `Node.val` are unique
- `-10^8 <= val <= 10^8`
- It's guaranteed that `val` does not exist in the original BST
