You are given the root of a binary tree. Lay the tree out on a text canvas as follows:

- Let the height `h` be the number of levels. The canvas has `h` rows and `2^h - 1` columns, initially all empty strings.
- Put the root label at the middle column of row 0.
- For a node placed at row `r` and column `c` with left bound `L` and right bound `R`, put its left child at row `r+1` and the middle of `[L, c-1]`, and its right child at row `r+1` and the middle of `[c+1, R]`. Keep splitting until every node is placed.

Return the filled canvas.

**Adaptation:** the canvas maps to a nested string list in this judge.

**Example 1:**
```
Input: root = [1,2]
Output: [["","1",""],["2","",""]]
Explanation: Height 2 gives a 2x3 grid; 1 sits centered on top and 2 sits at the left of the bottom row.
```

**Example 2:**
```
Input: root = [1,2,3,null,4]
Output: [["","","","1","","",""],["","2","","","","3",""],["","","4","","","",""]]
Explanation: Height 3 gives a 3x7 grid with each child centered under its parent side.
```

**Constraints:**
- `1 <= number of nodes <= 200`
- `-100 <= node value <= 100`
