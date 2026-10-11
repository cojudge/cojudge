A square `n x n` grid describes stacks of unit cubes: `grid[i][j]` cubes are piled on cell `(i, j)`. Picture the solid from three sides and count the visible unit squares:

- From above, every non-empty cell shows exactly one square.
- From the front, each row shows as many squares as its tallest stack.
- From the side, each column shows as many squares as its tallest stack.

Return the sum of the three views.

**Example 1:**
```
Input: grid = [[1,2],[3,4]]
Output: 17
Explanation: 4 squares from above, 2 + 4 = 6 from the front, and 3 + 4 = 7 from the side.
```

**Example 2:**
```
Input: grid = [[2]]
Output: 5
Explanation: 1 from above, 2 from the front, and 2 from the side.
```

**Example 3:**
```
Input: grid = [[1,0],[0,2]]
Output: 8
Explanation: 2 from above, 1 + 2 = 3 from the front, and 1 + 2 = 3 from the side.
```

**Constraints:**
- `n == grid.length == grid[i].length`
- `1 <= n <= 50`
- `0 <= grid[i][j] <= 100`
