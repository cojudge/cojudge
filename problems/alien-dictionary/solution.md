## Approach

Build a directed graph containing every character in the input. For each adjacent pair of words, the first differing characters give an ordering constraint. Store each edge only once so that indegrees count distinct dependencies. If no characters differ and the first word is longer, the dictionary is invalid because a word cannot precede its own prefix.

Perform topological sort using Kahn's algorithm: repeatedly remove a character with zero indegree and release its outgoing dependencies. If not all characters are processed, the graph contains a cycle, so return `""`.

## Complexity Analysis

- **Time Complexity:** **O(N × L)**, where N = `words.length` and L is the maximum length of a word in `words`. Initializing the graph scans at most N × L characters. Each of the N − 1 adjacent-word comparisons examines at most L characters. The topological sort takes constant time relative to the input size because the input contains only 26 possible lowercase English letters and each directed edge is stored only once.
- **Auxiliary Space Complexity:** **O(1)**. The graph has at most 26 characters and 26² distinct directed edges. The indegrees, queue, and result each hold at most 26 characters. The prefix check does not create string slices.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def alienOrder(self, words: List[str]) -> str:
        adj = {c: set() for w in words for c in w}
        indeg = {c: 0 for c in adj}
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i + 1]
            for j in range(min(len(w1), len(w2))):
                if w1[j] != w2[j]:
                    if w2[j] not in adj[w1[j]]:
                        adj[w1[j]].add(w2[j])
                        indeg[w2[j]] += 1
                    break
            else:
                if len(w1) > len(w2):
                    return ""

        q = deque(c for c in indeg if indeg[c] == 0)
        res = []
        while q:
            c = q.popleft()
            res.append(c)
            for nb in adj[c]:
                indeg[nb] -= 1
                if indeg[nb] == 0:
                    q.append(nb)
        return "".join(res) if len(res) == len(adj) else ""
```
