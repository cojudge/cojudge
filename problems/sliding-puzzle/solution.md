## Approach

Encode the 2x3 board as a six-character string and list, for each empty-slot index, which positions it can swap with. Breadth-first search over these strings explores states in order of move count, starting from the input encoding and stopping at 123450. The first time the target leaves the queue its distance is optimal; exhausting the queue means it is unreachable.

## Complexity Analysis

- **Time Complexity:** O(S) where S is at most 720 states (6 permutations), each expanding to at most 3 neighbors.
- **Space Complexity:** O(S) for the queue and visited set.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def slidingPuzzle(self, board: List[List[int]]) -> int:
        start = "".join(str(board[r][c]) for r in range(2) for c in range(3))
        target = "123450"
        if start == target:
            return 0
        nbr = {0: (1, 3), 1: (0, 2, 4), 2: (1, 5), 3: (0, 4), 4: (1, 3, 5), 5: (2, 4)}
        q = deque([start])
        seen = {start}
        dist = 0
        while q:
            for _ in range(len(q)):
                cur = q.popleft()
                if cur == target:
                    return dist
                z = cur.index('0')
                for nb in nbr[z]:
                    a = list(cur)
                    a[z], a[nb] = a[nb], a[z]
                    nxt = "".join(a)
                    if nxt not in seen:
                        seen.add(nxt)
                        q.append(nxt)
            dist += 1
        return -1
```
