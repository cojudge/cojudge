You are given a square grid where each cell holds `0` (empty), `1` (a cherry), or `-1` (a thorn that blocks passage).

One trip starts at the top-left corner, moves only right or down to the bottom-right corner, then returns from the bottom-right back to the top-left moving only left or up. A cherry on a visited cell is collected once: stepping on the same cell during both legs still yields just one cherry, and thorn cells can never be entered.

Because the return path mirrors a second forward path, think of two walkers moving from the top-left to the bottom-right together. Return the greatest number of cherries collectible over such a round trip, or `0` when no valid round trip exists.

**Example 1:**
```
Input: grid = [[0,1,-1],[1,0,-1],[1,1,1]]
Output: 5
Explanation: The two coordinated paths jointly cover five cherry cells while avoiding thorns.
```

**Example 2:**
```
Input: grid = [[1,1,-1],[1,-1,1],[-1,1,1]]
Output: 0
Explanation: Thorns seal off every route, so no round trip is possible.
```

**Example 3:**
```
Input: grid = [[1]]
Output: 1
```

**Constraints:**
- `1 <= grid.length <= 50`
- `grid[i].length == grid.length`
- Cells hold only `-1`, `0` or `1`.
