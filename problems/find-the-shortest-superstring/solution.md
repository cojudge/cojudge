## Approach

First measure every ordered overlap: the longest tail of word `i` that equals the head of word `j`. Then run dynamic programming over subsets where each state stores the best superstring covering a given set of words and ending with a given word. Extending a state appends an unused word trimmed by the overlap, keeping the shortest candidate. The answer is the best full-set state.

## Complexity Analysis

- **Time Complexity:** O(n^2 * 2^n * L) for n words of length up to L (n <= 12).
- **Space Complexity:** O(n * 2^n * L) for the table of partial superstrings.

## Implementation

```python
from typing import List
class Solution:
    def shortestSuperstring(self, words: List[str]) -> str:
        n = len(words)
        if n == 1:
            return words[0]
        ov = [[0] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                if i == j:
                    continue
                m = min(len(words[i]), len(words[j]))
                for k in range(m, 0, -1):
                    if words[i][-k:] == words[j][:k]:
                        ov[i][j] = k
                        break
        size = 1 << n
        dp = [[None] * n for _ in range(size)]
        for i in range(n):
            dp[1 << i][i] = words[i]
        for mask in range(size):
            for last in range(n):
                if not (mask & (1 << last)) or dp[mask][last] is None:
                    continue
                for nxt in range(n):
                    if mask & (1 << nxt):
                        continue
                    cand = dp[mask][last] + words[nxt][ov[last][nxt]:]
                    nm = mask | (1 << nxt)
                    cur = dp[nm][nxt]
                    if cur is None or len(cand) < len(cur) or (len(cand) == len(cur) and cand < cur):
                        dp[nm][nxt] = cand
        full = size - 1
        best = None
        for i in range(n):
            cur = dp[full][i]
            if cur is None:
                continue
            if best is None or len(cur) < len(best) or (len(cur) == len(best) and cur < best):
                best = cur
        return best
```
