You receive a reference to the root of a binary search tree alongside an integer `key`. Excise the node holding `key` from the tree, then return the (possibly new) root reference.

Conceptually the removal proceeds in two phases:
1. Locate the node storing the key.
2. When it is present, unlink it while keeping the binary search tree ordering intact.

**Constraints:**
- The number of nodes in the tree is in the range `[0, 10^4]`
- `-10^5 <= Node.val <= 10^5`
- Each node has a unique value
- `root` is a valid binary search tree
- `-10^5 <= key <= 10^5`
