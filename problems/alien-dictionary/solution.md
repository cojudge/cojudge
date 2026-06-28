## Approach

Build a directed graph from character order comparisons, then perform topological sort (Kahn's algorithm) to determine the letter ordering.

## Complexity Analysis

- **Time Complexity:** O(C) where C is total characters
- **Space Complexity:** O(1) (max 26 letters)

## Implementation

```python
from typing import List
class Solution:
    def alienOrder(self, words: List[str]) -> str:
        adj = {c: [] for w in words for c in w}
        indeg = {c: 0 for c in adj}
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            if len(w1) > len(w2) and w1[:len(w2)] == w2:
                return ""
            for j in range(min(len(w1), len(w2))):
                if w1[j] != w2[j]:
                    adj[w1[j]].append(w2[j])
                    indeg[w2[j]] = indeg.get(w2[j], 0) + 1
                    break
        q = [c for c in indeg if indeg[c] == 0]
        res = []
        while q:
            c = q.pop(0)
            res.append(c)
            for nb in adj[c]:
                indeg[nb] -= 1
                if indeg[nb] == 0:
                    q.append(nb)
        return "".join(res) if len(res) == len(adj) else ""
```
