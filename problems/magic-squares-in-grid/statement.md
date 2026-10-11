Count the 3 by 3 magic blocks hidden inside a number grid.

A 3 by 3 block is magic when it holds each integer from 1 through 9 exactly once, and every row, every column, and both long diagonals add to the same total (which must be 15). Scan every contiguous 3 by 3 window of `grid` and return how many of them are magic.

**Example 1:**
```
Input: grid = [[4,3,8,4],[9,5,1,9],[2,7,6,2]]
Output: 1
Explanation: The top-left window holds 1..9 with all lines summing to 15; no other window qualifies.
```

**Example 2:**
```
Input: grid = [[8]]
Output: 0
Explanation: The grid is smaller than 3 by 3, so no window exists.
```

**Example 3:**
```
Input: grid = [[5,5,5],[5,5,5],[5,5,5]]
Output: 0
Explanation: All entries repeat, failing the 1..9 distinctness rule.
```

**Constraints:**
- `1 <= grid.length, grid[i].length <= 50`
- `0 <= grid[i][j] <= 15`
