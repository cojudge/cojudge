## Approach

View the round trip as two walkers advancing from the start to the goal together, one step each per round, moving only right or down. After `t` rounds both walkers satisfy row + column = t, so a state needs only `(r1, c1, r2)` with `c2` derived. Transitions try the four arrival pairs; thorn cells and unreachable states are skipped. Walkers on the same cell score its cherry once, otherwise both cherries count. The goal state holds the optimum, or stays unreachable.

## Complexity Analysis

- **Time Complexity:** O(n^3), where n is the grid side: O(n) steps times O(n^2) walker pairs.
- **Space Complexity:** O(n^3) for the step-indexed table (compressible to O(n^2)).

## Implementation

```python
from typing import List
class Solution:
    def cherryPickup(self, grid: List[List[int]]) -> int:
        n = len(grid)
        N = 2 * n - 1
        NEG = -10 ** 9
        dp = [[[-10 ** 9] * n for _ in range(n)] for _ in range(N)]
        if grid[0][0] == -1:
            return 0
        dp[0][0][0] = grid[0][0]
        for t in range(1, N):
            for r1 in range(n):
                for r2 in range(n):
                    c1, c2 = t - r1, t - r2
                    if not (0 <= c1 < n and 0 <= c2 < n):
                        continue
                    if grid[r1][c1] == -1 or grid[r2][c2] == -1:
                        continue
                    best = NEG
                    for pr1 in (r1 - 1, r1):
                        for pr2 in (r2 - 1, r2):
                            if pr1 < 0 or pr2 < 0:
                                continue
                            best = max(best, dp[t - 1][pr1][pr2])
                    if best == NEG:
                        continue
                    add = grid[r1][c1] + (grid[r2][c2] if r1 != r2 else 0)
                    dp[t][r1][r2] = best + add
        return max(dp[N - 1][n - 1][n - 1], 0)
```
