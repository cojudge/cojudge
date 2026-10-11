## Approach

Treat each distinct pair of current row plus remaining hand counts as a search state. Depth-first search tries every useful insertion: a hand ball placed directly beside an equal-colored row ball. After each insertion a helper repeatedly strips runs of three or more until stable, then recursion continues. Memoization on the state keeps the branching tiny because the hand holds at most five balls. If no branch empties the row the answer is `-1`.

## Complexity Analysis

- **Time Complexity:** O(S * B * H) where S is the number of reachable states, B the row length and H the hand size. With the given limits this easily fits.
- **Space Complexity:** O(S) for the memo table and recursion stack.

## Implementation

```python
from typing import Dict, Tuple

class Solution:
    def findMinStep(self, board: str, hand: str) -> int:
        colors = ['R', 'Y', 'B', 'G', 'W']
        cnt = [hand.count(c) for c in colors]
        memo: Dict[Tuple[str, Tuple[int, ...]], int] = {}

        def collapse(s: str) -> str:
            cur = s
            while True:
                nxt = []
                i = 0
                changed = False
                while i < len(cur):
                    j = i
                    while j < len(cur) and cur[j] == cur[i]:
                        j += 1
                    if j - i >= 3:
                        changed = True
                    else:
                        nxt.append(cur[i:j])
                    i = j
                cur = "".join(nxt)
                if not changed:
                    return cur

        def dfs(b: str, h: Tuple[int, ...]) -> int:
            if not b:
                return 0
            key = (b, h)
            if key in memo:
                return memo[key]
            best = 100
            hlist = list(h)
            for ci, c in enumerate(colors):
                if hlist[ci] == 0:
                    continue
                seen = set()
                for i in range(len(b) + 1):
                    adj = (i > 0 and b[i - 1] == c) or (i < len(b) and b[i] == c)
                    if not adj:
                        continue
                    nb = collapse(b[:i] + c + b[i:])
                    if nb in seen:
                        continue
                    seen.add(nb)
                    hlist[ci] -= 1
                    sub = dfs(nb, tuple(hlist))
                    hlist[ci] += 1
                    if sub < 100:
                        best = min(best, 1 + sub)
            memo[key] = best
            return best

        ans = dfs(board, tuple(cnt))
        return -1 if ans >= 100 else ans
```
