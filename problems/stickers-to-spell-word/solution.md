## Approach

Turn every sticker into a 26-letter frequency table and memoize the best cost for each subset of target positions (bitmask). The recursion always fixes the first uncovered position, then tries only stickers containing that letter, greedily consuming matching letters to reach a new mask. A quick alphabet check reports impossible goals early. The mask covering everything costs zero; other masks take one plus the best successor.

## Complexity Analysis

- **Time Complexity:** O(2^m * S * m), where m is the target length (at most 15) and S the sticker count.
- **Space Complexity:** O(2^m) memo states.

## Implementation

```python
from typing import List
class Solution:
    def minStickers(self, stickers: List[str], target: str) -> int:
        m = len(target)
        counts = [[0]*26 for _ in stickers]
        for i, s in enumerate(stickers):
            for c in s:
                counts[i][ord(c)-97] += 1
        has = [False]*26
        for co in counts:
            for j in range(26):
                if co[j]:
                    has[j] = True
        for c in target:
            if not has[ord(c)-97]:
                return -1
        from functools import lru_cache
        INF = 10**9
        @lru_cache(None)
        def dfs(mask):
            if mask == (1 << m) - 1:
                return 0
            first = next(i for i in range(m) if not (mask >> i) & 1)
            best = INF
            for co in counts:
                if co[ord(target[first])-97] == 0:
                    continue
                rem = co[:]
                nmask = mask
                for i in range(m):
                    if (nmask >> i) & 1:
                        continue
                    c = ord(target[i])-97
                    if rem[c] > 0:
                        rem[c] -= 1
                        nmask |= (1 << i)
                if nmask == mask:
                    continue
                sub = dfs(nmask)
                if sub < INF:
                    best = min(best, 1 + sub)
            return best
        ans = dfs(0)
        return -1 if ans >= INF else ans
```
