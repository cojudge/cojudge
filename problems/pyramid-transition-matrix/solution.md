## Approach

Index every allowed triple by its two-letter base to list possible tops instantly. Then search depth-first: expand the current row into all candidate rows above it by combining per-pair options, and recurse on each candidate. Cache rows proven impossible so repeated states are skipped. Reaching a single block means success.

## Complexity Analysis

- **Time Complexity:** Exponential in the worst case, but tiny here since the base holds at most 6 blocks over 6 letters.
- **Space Complexity:** O(R * B) for the map plus recursion state, where R is the number of distinct pairs and B bounds the candidate rows.

## Implementation

```python
from typing import List
from collections import defaultdict
class Solution:
    def pyramidTransition(self, bottom: str, allowed: List[str]) -> bool:
        table = defaultdict(list)
        for s in allowed:
            table[s[:2]].append(s[2])
        failed = set()
        def dfs(row):
            if len(row) == 1:
                return True
            if row in failed:
                return False
            cands = ['']
            for i in range(len(row) - 1):
                tops = table.get(row[i:i+2])
                if not tops:
                    failed.add(row)
                    return False
                cands = [r + c for r in cands for c in tops]
            for nx in cands:
                if dfs(nx):
                    return True
            failed.add(row)
            return False
        return dfs(bottom)
```
