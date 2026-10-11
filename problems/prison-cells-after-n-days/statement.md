Eight holding cells sit in a row, each either occupied (`1`) or empty (`0`). Every day each cell is refreshed at the same time: a cell becomes occupied when its left and right neighbours currently hold the same value (both occupied or both empty), and becomes empty otherwise. The two end cells have only one neighbour, so they always become empty after the first day.

Given the starting layout `cells` and a day count `N`, return the layout of the row right after the `N`-th daily refresh.

**Constraints:**
- `cells.length == 8`
- Each entry of `cells` is `0` or `1`
- `1 <= N <= 10^9` (so a day-by-day simulation needs cycle skipping)
