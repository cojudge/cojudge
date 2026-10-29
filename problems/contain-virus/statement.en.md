A laboratory floor is modeled as a binary grid `isInfected`, where `0` means a healthy cell and `1` means an infected cell. One wall can be raised on the shared edge between two neighboring cells that touch up, down, left, or right.

Time advances in days. Each morning you pick exactly one connected block of infected cells and seal it completely: every edge touching a healthy cell gets a wall, and that block never spreads again. Each night every unsealed infected block copies itself into all four neighbors unless a wall or the grid border stops it.

On each day you must pick the block that endangers the most distinct healthy cells for the coming night; the task guarantees this choice is never tied while spreading is still possible. Sealed cells are frozen and healthy cells that get touched become infected for the next day.

Return the total number of walls raised until no unsealed infection can reach a healthy cell. If the whole floor ends up infected, return the walls raised along the way.

**Constraints:**
- `m == isInfected.length`, `n == isInfected[i].length`
- `1 <= m, n <= 50`
- Each entry is `0` or `1`.
- While spreading continues, one block always threatens strictly more healthy cells than any other.
