Given the root of a binary tree, count the subtrees in which every node holds the same value. A single node (including each leaf) qualifies, and an empty tree contributes zero.

A subtree rooted at some node is univalue when that node's value matches the values of its left and right subtrees and both of those subtrees are themselves univalue. Empty children count as univalue.

Return the total number of such subtrees.

**Constraints:**
- The number of nodes is in the range `[0, 1000]`.
- `-1000 <= Node.val <= 1000`
