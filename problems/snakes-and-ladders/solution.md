## Approach

Label every cell with its square number by walking rows from the bottom, flipping the column direction on alternate rows. From a square, each die outcome leads to one of the following six labels (clamped to the final square), with snakes and ladders applied instantly. Since every throw costs the same, breadth-first search from square 1 yields the minimum throw count, and an unvisited final square means it is unreachable.

## Complexity Analysis

- **Time Complexity:** O(n^2), each square is enqueued at most once with up to 6 transitions.
- **Space Complexity:** O(n^2) for the distance table and queue.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def snakesAndLadders(self, board: List[List[int]]) -> int:
        n = len(board)
        target = n * n
        def coords(s: int):
            q, r = divmod(s - 1, n)
            row = n - 1 - q
            col = r if q % 2 == 0 else n - 1 - r
            return row, col
        dist = {1: 0}
        dq = deque([1])
        while dq:
            cur = dq.popleft()
            if cur == target:
                return dist[cur]
            for nxt in range(cur + 1, min(cur + 6, target) + 1):
                r, c = coords(nxt)
                dest = board[r][c] if board[r][c] != -1 else nxt
                if dest not in dist:
                    dist[dest] = dist[cur] + 1
                    dq.append(dest)
        return -1
```
