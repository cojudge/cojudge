You are given the root of a binary tree. Lay the tree out on a text canvas as follows:

- Let the height `h` be the number of levels. The canvas has `h` rows and `2^h - 1` columns, initially all empty strings.
- Put the root label at the middle column of row 0.
- For a node placed at row `r` and column `c` with left bound `L` and right bound `R`, put its left child at row `r+1` and the middle of `[L, c-1]`, and its right child at row `r+1` and the middle of `[c+1, R]`. Keep splitting until every node is placed.

Return the filled canvas.

**Adaptation:** the canvas maps to a nested string list in this judge.

**Constraints:**
- `1 <= number of nodes <= 200`
- `-100 <= node value <= 100`
