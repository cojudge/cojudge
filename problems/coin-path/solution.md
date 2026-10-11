## Approach

Process cells from right to left. The cheapest price from `i` equals `coins[i]` plus the best price among the next `maxJump` landable cells. Blocked cells stay unreachable. When two successors tie, compare the full paths starting at each successor and keep the lexicographically smaller one. Finally walk the successor links from cell 0.

## Complexity Analysis

- **Time Complexity:** O(n * maxJump + n^2) with lexicographic tie checks.
- **Space Complexity:** O(n) for costs and successor links.

## Implementation

```python
from typing import List
class Solution:
    def cheapestJump(self, coins: List[int], maxJump: int) -> List[int]:
        n = len(coins)
        if n == 0 or coins[0] == -1 or coins[-1] == -1:
            return []
        INF = 10 ** 18
        dp = [INF] * n
        nxt = [-1] * n
        dp[n - 1] = coins[n - 1]
        def path_from(s):
            p = []
            while s != -1:
                p.append(s)
                if s == n - 1:
                    break
                s = nxt[s]
            return p
        for i in range(n - 2, -1, -1):
            if coins[i] == -1:
                continue
            for j in range(i + 1, min(n, i + maxJump + 1)):
                if coins[j] == -1 or dp[j] == INF:
                    continue
                cand = coins[i] + dp[j]
                if cand < dp[i]:
                    dp[i] = cand
                    nxt[i] = j
                elif cand == dp[i]:
                    if path_from(j) < path_from(nxt[i]):
                        nxt[i] = j
        if dp[0] == INF:
            return []
        return [x + 1 for x in path_from(0)]
```
