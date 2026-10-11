A brick wall has several rows. Row `i` is described by a list of brick widths whose total is the same for every row. You must draw one straight vertical cut from the top of the wall to the bottom, choosing a position that is not on either outer edge.

Whenever the cut passes through the interior of a brick it counts as crossed; passing exactly along a brick boundary avoids crossing that row's brick. Return the smallest possible number of crossed bricks.

**Example 1:**
```
Input: wall = [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]
Output: 2
Explanation: Cutting at offset 4 follows four row boundaries and crosses only two bricks.
```

**Example 2:**
```
Input: wall = [[1],[1],[1]]
Output: 3
Explanation: Single-brick rows have no inner boundary, so any cut crosses all three.
```

**Example 3:**
```
Input: wall = [[1,1],[2]]
Output: 1
Explanation: Cutting at offset 1 misses one brick and crosses the other row.
```

**Constraints:**
- `n == wall.length`
- `1 <= n <= 10^4`
- `1 <= wall[i].length <= 10^4`
- `1 <= sum(wall[i].length) <= 2 * 10^4`
- Every row sums to the same total width
- `1 <= wall[i][j] <= 2^31 - 1`

Adaptation note: the original signature uses nested lists; here it is modelled as `int[][] wall` (`int_array_2d`) with identical values.
