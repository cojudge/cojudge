## Approach

BFS from `"0000"`. Each state has 8 neighbors (turn each of 4 wheels ±1). Skip dead ends and visited states.

## Complexity Analysis

- **Time Complexity:** O(10^4) states
- **Space Complexity:** O(10^4)

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def openLock(self, deadends: List[str], target: str) -> int:
        dead = set(deadends)
        if "0000" in dead:
            return -1
        if target == "0000":
            return 0
        q = deque(["0000"])
        seen = {"0000"}
        steps = 0
        while q:
            for _ in range(len(q)):
                cur = q.popleft()
                for i in range(4):
                    for d in (-1, 1):
                        chars = list(cur)
                        chars[i] = str((int(chars[i]) + d) % 10)
                        nxt = "".join(chars)
                        if nxt in seen or nxt in dead:
                            continue
                        if nxt == target:
                            return steps + 1
                        seen.add(nxt)
                        q.append(nxt)
            steps += 1
        return -1
```
