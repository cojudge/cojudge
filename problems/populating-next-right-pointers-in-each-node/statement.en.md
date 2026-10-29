Consider a perfect binary tree — every interior node has two children and all leaves sit on the same depth. Conceptually, each node should gain a link to its nearest neighbor on the same level (or nothing at the row end).

Link every level left-to-right using these neighbor pointers, ideally reusing constant extra space by walking the already-linked upper row. Return the root afterwards.

**Constraints:**
- `0 <= number of nodes <= 2^12 - 1`
- `-1000 <= Node.val <= 1000`
- The input is a perfect binary tree.

**Adaptation note:** The original statement uses a `Node` type with `left`, `right`, and `next` fields. This judge models only `TreeNode` (`val`, `left`, `right`); neighbor links cannot be serialized, so solutions return the same tree and grading verifies that values and structure are preserved. Document your level-linking logic in comments.
