## Approach

Track how likely the knight is to stand on each square after each jump. Start with certainty on the given square, then repeatedly spread every square's mass evenly over its on-board knight destinations (each gets one eighth). Squares with no mass are skipped, and only two board-sized layers are kept. After `k` rounds the sum of the layer is the survival chance, formatted as a decimal string.

## Complexity Analysis

- **Time Complexity:** O(k * n^2), one pass over the board per jump.
- **Space Complexity:** O(n^2) for two layers.

## Implementation

```python
class Solution:
    def knightProbability(self, n: int, k: int, row: int, column: int) -> str:
        moves = [(2,1),(1,2),(-1,2),(-2,1),(-2,-1),(-1,-2),(1,-2),(2,-1)]
        cur = [[0.0]*n for _ in range(n)]
        cur[row][column] = 1.0
        for _ in range(k):
            nxt = [[0.0]*n for _ in range(n)]
            for r in range(n):
                for c in range(n):
                    if cur[r][c] == 0:
                        continue
                    for dr, dc in moves:
                        nr, nc = r+dr, c+dc
                        if 0 <= nr < n and 0 <= nc < n:
                            nxt[nr][nc] += cur[r][c] / 8.0
            cur = nxt
        return str(sum(sum(r) for r in cur))
```
