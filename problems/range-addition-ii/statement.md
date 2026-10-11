Start with an `m` by `n` grid of zeros. Each entry `[a,b]` in `ops` adds one to every cell with row below `a` and column below `b`. After all steps, count how many cells hold the largest value.

Because every step starts at the origin, the most-incremented cells are exactly the overlap of all requested rectangles.

**Example 1:**
```
Input: m = 3, n = 3, ops = [[2,2],[3,3]]
Output: 4
```

**Example 2:**
```
Input: m = 3, n = 3, ops = [[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3],[2,2],[3,3],[3,3],[3,3]]
Output: 4
```

**Example 3:**
```
Input: m = 3, n = 3, ops = []
Output: 9
```

**Constraints:**
- `1 <= m, n <= 40000`
- `0 <= ops.length <= 10000`, each `[a,b]` with `1 <= a <= m`, `1 <= b <= n`.
