## Approach

Record, for every ordered dot pair, which intermediate dot a straight jump would cross (zero when none exists). Then depth-first search over subsets: from the current dot, try each unused next dot whose crossing requirement is empty or already visited, marking it and continuing. Paths whose length lands inside `[m, n]` each contribute one. Rotational symmetry cuts the work to three starts — a corner, an edge, and the center — multiplied by 4, 4, and 1.

## Complexity Analysis

- **Time Complexity:** Proportional to explored patterns (bounded by P(9,9) with pruning), trivial for 9 dots.
- **Space Complexity:** O(9) for the visited flags plus recursion depth.

## Implementation

```python
class Solution:
    def numberOfPatterns(self, m: int, n: int) -> int:
        skip = [[0] * 10 for _ in range(10)]
        for a, b, mid in [(1,3,2),(3,1,2),(1,7,4),(7,1,4),(3,9,6),(9,3,6),
                          (7,9,8),(9,7,8),(1,9,5),(9,1,5),(2,8,5),(8,2,5),
                          (3,7,5),(7,3,5),(4,6,5),(6,4,5)]:
            skip[a][b] = mid
        used = [False] * 10
        def dfs(cur, length):
            used[cur] = True
            length += 1
            total = 1 if length >= m else 0
            if length < n:
                for nxt in range(1, 10):
                    if not used[nxt] and (skip[cur][nxt] == 0 or used[skip[cur][nxt]]):
                        total += dfs(nxt, length)
            used[cur] = False
            return total
        return dfs(1, 0) * 4 + dfs(2, 0) * 4 + dfs(5, 0)
```
