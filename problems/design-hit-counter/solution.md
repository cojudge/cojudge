## Approach

Because timestamps arrive in non-decreasing order, a queue of hit times stays sorted. Each query first discards every hit at or below `T - 300`, then reports the queue size as the number of hits inside the open-closed window `(T - 300, T]`. `hit` appends in O(1) amortized time.

## Complexity Analysis

- **Time Complexity:** O(1) amortized per call — each hit enters and leaves the queue once.
- **Space Complexity:** O(w) for the hits inside the current window.

## Implementation

```python
from collections import deque

class HitCounter:
    def __init__(self):
        self.q = deque()

    def hit(self, timestamp: int) -> None:
        self.q.append(timestamp)

    def getHits(self, timestamp: int) -> int:
        while self.q and self.q[0] <= timestamp - 300:
            self.q.popleft()
        return len(self.q)
```
