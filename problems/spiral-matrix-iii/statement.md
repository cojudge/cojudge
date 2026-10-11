A grid has `rows` rows and `cols` columns. You start on cell `(rStart, cStart)` and walk in an ever-widening rectangular spiral: one step east, one step south, two steps west, two steps north, three steps east, three steps south, and so on, adding one to the step length after every two turns. Some of these steps leave the grid; ignore those cells but keep walking.

Collect the grid cells in the exact order first visited, stopping once every cell of the grid has been collected. Return that list of `[row, col]` pairs.

**Constraints:**
- `1 <= rows, cols <= 100`
- `0 <= rStart < rows`
- `0 <= cStart < cols`
