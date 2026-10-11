A grid has `rows` rows and `cols` columns. You start on cell `(rStart, cStart)` and walk in an ever-widening rectangular spiral: one step east, one step south, two steps west, two steps north, three steps east, three steps south, and so on, adding one to the step length after every two turns. Some of these steps leave the grid; ignore those cells but keep walking.

Collect the grid cells in the exact order first visited, stopping once every cell of the grid has been collected. Return that list of `[row, col]` pairs.

**Example 1:**
```
Input: rows = 1, cols = 4, rStart = 0, cStart = 0
Output: [[0,0],[0,1],[0,2],[0,3]]
Explanation: The single row is swept from left to right.
```

**Example 2:**
```
Input: rows = 3, cols = 3, rStart = 0, cStart = 0
Output: [[0,0],[0,1],[1,1],[1,0],[0,2],[1,2],[2,2],[2,1],[2,0]]
Explanation: The spiral first covers the top-left 2x2 block, then reaches out to the remaining border cells.
```

**Example 3:**
```
Input: rows = 2, cols = 2, rStart = 1, cStart = 1
Output: [[1,1],[1,0],[0,0],[0,1]]
Explanation: Starting from the bottom-right corner, the spiral curls around the other three cells.
```

**Constraints:**
- `1 <= rows, cols <= 100`
- `0 <= rStart < rows`
- `0 <= cStart < cols`
