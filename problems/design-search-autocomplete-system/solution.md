## Approach

Store sentence heats in a hash map and accumulate the live prefix in a buffer. Preloading splits the init string on `;` and each entry on the last `:` to recover sentences that may hold spaces. Each keystroke either commits the buffer on `#` (bumping its heat and clearing) or extends the prefix, gathers all stored sentences with that prefix, and orders them by heat descending with ASCII tie-breaks, keeping the first three.

## Complexity Analysis

- **Time Complexity:** O(K * S log S) over K keystrokes and S stored sentences for the per-keystroke gather and sort.
- **Space Complexity:** O(S * L) for the stored sentences of length up to L.

## Implementation

```python
from typing import List

class Solution:
    def runAutocomplete(self, operations: List[str], values: List[str]) -> List[List[str]]:
        hot = {}
        init = values[0]
        if init:
            for entry in init.split(";"):
                if not entry:
                    continue
                p = entry.rfind(":")
                hot[entry[:p]] = int(entry[p+1:])
        cur = ""
        out = []
        for c in values[1:]:
            if c == "#":
                hot[cur] = hot.get(cur, 0) + 1
                cur = ""
                out.append([])
            else:
                cur += c
                cand = [s for s in hot if s.startswith(cur)]
                cand.sort(key=lambda s: (-hot[s], s))
                out.append(cand[:3])
        return out
```
