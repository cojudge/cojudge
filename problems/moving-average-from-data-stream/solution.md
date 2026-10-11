## Approach

Replay the session with a FIFO queue plus a running total. The first argument fixes the window width; each `next` appends its value, evicts the oldest entry when the queue overflows, and records the quotient of the sum over the current queue length. Queue operations keep every step constant time while preserving exact window contents.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the number of `next` calls.
- **Space Complexity:** O(size) for the stored window.

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def runMovingAverage(self, operations: List[str], args: List[List[int]]) -> List[str]:
        size = args[0][0]
        q = deque()
        total = 0
        out = []
        for op, a in zip(operations[1:], args[1:]):
            if op == "next":
                q.append(a[0])
                total += a[0]
                if len(q) > size:
                    total -= q.popleft()
                out.append(str(total / len(q)))
        return out
```
