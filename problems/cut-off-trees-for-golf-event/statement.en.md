You are given a rectangular grid `forest` of integers. Adaptation note: the grid is passed as `int_array_2d`.

- `0` means a blocked cell that cannot be entered,
- `1` means walkable ground with no tree,
- any value above `1` means a tree whose height equals that value.

Start at the top-left cell `(0,0)`. Repeatedly walk to the nearest remaining tree with the smallest height (using 4-directional moves through non-blocked cells), cut it (it becomes walkable), and continue. The walk length between trees is the shortest path distance.

Return the total number of steps over the whole tour, or `-1` when some tree cannot be reached. When no tree above height 1 exists, the total is `0`.

**Constraints:**
- `1 <= forest.length, forest[0].length <= 50`
- `0 <= forest[i][j] <= 10^9`
