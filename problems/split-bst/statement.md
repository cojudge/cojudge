You are given the root of a binary search tree and an integer `target`. Divide the tree into two subtrees so that every value at most `target` lands in the first part and every larger value lands in the second part, keeping the original ancestor relations wherever possible.

Concretely, split recursively: an empty tree splits into two empty trees; if the root value is at most `target`, its left subtree stays whole and its right subtree is split, reattaching the small half as the new right child; otherwise its right subtree stays whole and its left subtree is split, reattaching the large half as the new left child.

Because this judge has no pair-of-trees type, the two halves travel as BFS strings (portable adaptation following the unique-bst-ii precedent): return a two-element list `[small, large]` where each entry is the level-order serialization of that half (`[]` for an empty tree, `null` for missing children, trailing nulls trimmed).

**Constraints:**
- `0 <= nodes <= 50`
- `-100 <= Node.val <= 100`, all values distinct, BST ordered
- `-100 <= target <= 100`
- Outputs are BFS strings parseable as trees
