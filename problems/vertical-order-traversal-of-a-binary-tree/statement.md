Place the binary tree on a grid: the root sits at column 0 and row 0; a left child moves to column - 1 and row + 1, while a right child moves to column + 1 and row + 1.

Collect nodes column by column from left to right. Inside one column, order nodes by row from top to bottom; nodes sharing both column and row are ordered by value increasingly. Return the sequence of columns, each as a list of values in that order.

**Constraints:**
- The tree holds 1 to 1000 nodes.
- Node values range from 0 to 1000.
