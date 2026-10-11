## Approach

Precompute a map from every prefix to the words carrying it. Then extend a partial square one row at a time: the letters already placed in column `r` spell the prefix the next word must have. Look up candidates with that prefix and recurse. A full-size arrangement is a valid square by construction.

## Complexity Analysis

- **Time Complexity:** O(candidates explored). Prefix lookups are O(1) and each complete square costs O(n^2) to copy.
- **Space Complexity:** O(total prefix entries + recursion depth n).

## Implementation

```python
from typing import List
class Solution:
    def wordSquares(self, words: List[str]) -> List[List[str]]:
        if not words:
            return []
        n = len(words[0])
        pref = {}
        for w in words:
            for i in range(n + 1):
                pref.setdefault(w[:i], []).append(w)
        ans = []
        def backtrack(cur):
            if len(cur) == n:
                ans.append(list(cur))
                return
            r = len(cur)
            need = ''.join(row[r] for row in cur)
            for w in pref.get(need, []):
                cur.append(w)
                backtrack(cur)
                cur.pop()
        backtrack([])
        return ans
```
