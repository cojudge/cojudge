Eight holding cells sit in a row, each either occupied (`1`) or empty (`0`). Every day each cell is refreshed at the same time: a cell becomes occupied when its left and right neighbours currently hold the same value (both occupied or both empty), and becomes empty otherwise. The two end cells have only one neighbour, so they always become empty after the first day.

Given the starting layout `cells` and a day count `N`, return the layout of the row right after the `N`-th daily refresh.

**Example 1:**
```
Input: cells = [0,1,0,1,1,0,0,1], N = 7
Output: [0,0,1,1,0,0,0,0]
Explanation: After seven daily updates the row settles into [0,0,1,1,0,0,0,0].
```

**Example 2:**
```
Input: cells = [1,0,0,1,0,0,1,0], N = 1
Output: [0,0,0,1,0,0,1,0]
Explanation: A single update turns each interior cell on exactly when its two neighbours match.
```

**Example 3:**
```
Input: cells = [1,1,1,0,1,1,1,1], N = 2
Output: [0,1,1,1,1,0,0,0]
Explanation: Two updates in a row propagate the single gap across the row.
```

**Constraints:**
- `cells.length == 8`
- Each entry of `cells` is `0` or `1`
- `1 <= N <= 10^9` (so a day-by-day simulation needs cycle skipping)
