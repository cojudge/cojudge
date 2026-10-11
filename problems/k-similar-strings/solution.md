## Approach

Run breadth-first search from `s1`, where neighbours are swaps fixing the first mismatch. Always swap that index with a later position holding the needed target letter (and not already correct there) to prune heavily. Levels count swaps, so the first arrival at `s2` is minimal; a visited set blocks repeats.

## Complexity Analysis

- **Time Complexity:** Exponential in the worst case but tiny for length up to 20 thanks to pruning; each state fans out to few swaps.
- **Space Complexity:** O(states) for the queue and visited set.

## Implementation

```python
from collections import deque
class Solution:
    def kSimilarity(self, s1: str, s2: str) -> int:
        if s1 == s2:
            return 0
        q = deque([s1])
        seen = {s1}
        steps = 0
        while q:
            steps += 1
            for _ in range(len(q)):
                cur = q.popleft()
                i = 0
                while i < len(cur) and cur[i] == s2[i]:
                    i += 1
                lst = list(cur)
                for j in range(i + 1, len(cur)):
                    if lst[j] == s2[i] and lst[j] != s2[j]:
                        lst[i], lst[j] = lst[j], lst[i]
                        nxt = ''.join(lst)
                        if nxt == s2:
                            return steps
                        if nxt not in seen:
                            seen.add(nxt)
                            q.append(nxt)
                        lst[i], lst[j] = lst[j], lst[i]
        return -1
```
