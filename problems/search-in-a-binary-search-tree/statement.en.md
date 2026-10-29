You are given the root of a binary search tree and an integer `val`. In such a tree, every left descendant is smaller than its ancestor and every right descendant is larger.

Locate the node whose value equals `val` and return the whole subtree starting there (encoded in level order). If no node holds `val`, return an empty tree `[]`.

**Constraints:**
- Node count lies in `[1, 5000]`.
- `1 <= Node.val, val <= 10^7`
- The input is a valid search tree.
