You are given the root of a binary tree. Picture each node sitting in a vertical column: the root starts at column `0`, a left child moves one column left, and a right child moves one column right.

Collect the node values column by column, ordering the columns from leftmost to rightmost. Inside a single column, list values from top to bottom; when several nodes share the same row and column, keep their left-to-right visiting order (as produced by a level-by-level scan that always visits a left child before its right sibling). Return the resulting list of columns.

**Constraints:**
- The tree holds between `0` and `100` nodes.
- `-100 <= Node.val <= 100`
