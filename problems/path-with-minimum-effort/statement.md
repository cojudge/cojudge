You are planning a walk over a terrain map `heights` with `rows` rows and `columns` columns, where `heights[row][col]` is the altitude of that square. The walk begins at the upper-left corner `(0, 0)` and must finish at the lower-right corner `(rows-1, columns-1)`, moving only to the four directly neighboring squares.

For any chosen walk, look at the absolute altitude change between each pair of successive squares and take the largest of those changes; that maximum is the walk's effort. Among all possible walks, return the smallest achievable effort.

**Example 1:**
```
Input: heights = [[1,2,2],[3,8,2],[5,3,5]]
Output: 2
Explanation: Following the values [1,3,5,3,5] keeps every neighboring altitude change at most 2.
The alternative values [1,2,2,2,5] force a change as large as 3.
```

**Example 2:**
```
Input: heights = [[1,2,3],[3,8,4],[5,3,5]]
Output: 1
Explanation: Following the values [1,2,3,4,5] keeps every neighboring altitude change at most 1,
which improves on the walk [1,3,5,3,5].
```

**Example 3:**
```
Input: heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]
Output: 0
Explanation: A walk exists whose successive squares never change altitude.
```

**Constraints:**
- `rows == heights.length`
- `columns == heights[i].length`
- `1 <= rows, columns <= 100`
- `1 <= heights[i][j] <= 10^6`
