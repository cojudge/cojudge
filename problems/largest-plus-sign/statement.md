You own an `n x n` grid whose cells all start as `1`. A list `mines` marks cells that are flipped to `0`; each entry is a `[row, col]` pair.

An axis-aligned plus of order `k` needs a center cell holding `1` plus four straight arms of `1`s reaching `k - 1` steps up, down, left, and right from that center. Cells outside the arms are irrelevant. Return the greatest order achievable anywhere in the grid, or `0` when no `1` remains.

**Example 1:**
```
Input: n = 5, mines = [[4,2]]
Output: 2
Explanation: With a single zero at (4,2), the best center still keeps one step of ones in each direction, giving order 2.
```

**Example 2:**
```
Input: n = 1, mines = [[0,0]]
Output: 0
Explanation: The only cell is mined, so no plus fits.
```

**Example 3:**
```
Input: n = 3, mines = []
Output: 2
Explanation: The middle of a full 3x3 grid reaches one cell each way.
```

**Constraints:**
- `1 <= n <= 500`
- `0 <= mines.length <= 5000`
- `0 <= xi, yi < n`
- All mine pairs are unique
