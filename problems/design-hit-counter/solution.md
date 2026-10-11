## Approach

Because timestamps arrive in order, a queue of hit times stays sorted. Each
query first discards hits at or below `T - 300`, then reports the queue size
as the number of hits inside the open-closed window `(T-300, T]`.

## Complexity Analysis

- **Time Complexity:** O(n), each hit enters and leaves the queue once.
- **Space Complexity:** O(w) for hits inside the current window.

## Implementation

```python
from typing import List
from collections import deque

class Solution:
    def runHitCounter(self, operations: List[str], timestamps: List[int]) -> List[int]:
        q: deque = deque()
        ans = []
        for op, t in zip(operations, timestamps):
            if op == "hit":
                q.append(t)
            elif op == "getHits":
                while q and q[0] <= t - 300:
                    q.popleft()
                ans.append(len(q))
        return ans
```
