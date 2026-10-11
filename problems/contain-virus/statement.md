A laboratory floor is modeled as a binary grid `isInfected`, where `0` means a healthy cell and `1` means an infected cell. One wall can be raised on the shared edge between two neighboring cells that touch up, down, left, or right.

Time advances in days. Each morning you pick exactly one connected block of infected cells and seal it completely: every edge touching a healthy cell gets a wall, and that block never spreads again. Each night every unsealed infected block copies itself into all four neighbors unless a wall or the grid border stops it.

On each day you must pick the block that endangers the most distinct healthy cells for the coming night; the task guarantees this choice is never tied while spreading is still possible. Sealed cells are frozen and healthy cells that get touched become infected for the next day.

Return the total number of walls raised until no unsealed infection can reach a healthy cell. If the whole floor ends up infected, return the walls raised along the way.

**Example 1:**
```
Input: isInfected = [[0,1,0,0,0,0,0,1],[0,1,0,0,0,0,0,1],[0,0,0,0,0,0,0,1],[0,0,0,0,0,0,0,0]]
Output: 10
Explanation: Two blocks exist. Seal the left one first with 5 walls, let the right one expand one step, then seal it with 5 more walls.
```

**Example 2:**
```
Input: isInfected = [[1,1,1],[1,0,1],[1,1,1]]
Output: 4
Explanation: A single ring surrounds one healthy cell; 4 walls close the ring.
```

**Example 3:**
```
Input: isInfected = [[1,1,1,0,0,0,0,0,0],[1,0,1,0,1,1,1,1,1],[1,1,1,0,0,0,0,0,0]]
Output: 13
Explanation: The left ring is sealed first, then the right mass is contained over later days for 13 walls in total.
```

**Constraints:**
- `m == isInfected.length`, `n == isInfected[i].length`
- `1 <= m, n <= 50`
- Each entry is `0` or `1`.
- While spreading continues, one block always threatens strictly more healthy cells than any other.
