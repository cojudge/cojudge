Picture an `n` by `n` board. On the cell in row `i`, column `j` you pile up `grid[i][j]` unit cubes, one on top of another, forming a small tower (a zero means the cell stays empty). Towers that touch side-by-side hide the faces where they meet, and cubes stacked vertically hide the faces between them.

Count every square that remains visible from the outside, counting the underside that rests on the table as well.

**Example 1:**
```
Input: grid = [[1,2],[3,4]]
Output: 34
Explanation: Each lone tower would show 4*v+2 squares; subtracting twice the overlap with each neighbour leaves 34.
```

**Example 2:**
```
Input: grid = [[1,1,1],[1,0,1],[1,1,1]]
Output: 32
Explanation: A ring of eight single cubes around an empty middle exposes 32 squares.
```

**Example 3:**
```
Input: grid = [[2,2,2],[2,1,2],[2,2,2]]
Output: 46
Explanation: The taller border towers plus the shorter centre combine to 46 after hiding shared sides.
```

**Constraints:**
- `n == grid.length == grid[i].length`
- `1 <= n <= 50`
- `0 <= grid[i][j] <= 50`
