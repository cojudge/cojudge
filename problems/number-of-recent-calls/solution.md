## Approach

Replay the calls with a queue holding the window. For each new time, append it and discard front entries older than `t - 3000`. The queue size is the ping answer for that step.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of pings. Each time enters and leaves the queue once.
- **Space Complexity:** O(w) for the window contents, at most O(n).

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def runRecentCalls(self, pings: List[int]) -> List[int]:
        q = deque()
        ans = []
        for t in pings:
            q.append(t)
            while q[0] < t - 3000:
                q.popleft()
            ans.append(len(q))
        return ans
```
