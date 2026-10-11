Given an array `preorder` of distinct integers, decide whether it could be the preorder walk of some binary search tree. In a preorder walk the root comes first, then the whole left subtree, then the whole right subtree, and every left descendant is smaller than its ancestor while every right descendant is larger.

Return `true` when such a tree exists and `false` otherwise.

**Constraints:**
- `1 <= preorder.length <= 10^4`
- `-10^4 <= preorder[i] <= 10^4`
- All values in `preorder` are distinct.
