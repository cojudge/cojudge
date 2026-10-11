An `m x n` grid marks each friend's home with a `1` (all other cells are `0`). Friends may
meet at any cell, and everyone travels with Manhattan distance `|x1-x2| + |y1-y2|`. Return
the smallest possible total travel distance over all meeting cells. There is at least one
friend on the grid.

**Example 1:**
```
Input: grid = [[1,0,0,0,1],[0,0,0,0,0],[0,0,1,0,0]]
Output: 6
Explanation: Meeting at (0,2) costs 2 + 2 + 2 = 6, which is optimal.
```

**Example 2:**
```
Input: grid = [[1,1]]
Output: 1
Explanation: Neighbouring homes meet with total cost 1.
```

**Example 3:**
```
Input: grid = [[1]]
Output: 0
Explanation: A single friend is already home.
```

**Constraints:**
- `1 <= m, n <= 200`
- `grid[i][j]` is `0` or `1`.
- The grid holds at least one `1`.
