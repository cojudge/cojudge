## Approach

Map each parent id to its direct children, then walk downward from the target with a queue. Every reached id stops, so collecting them yields the full affected set.

## Complexity Analysis

- **Time Complexity:** O(n), each id is visited once.
- **Space Complexity:** O(n) for the child map and the queue.

## Implementation

```python
from typing import List
from collections import defaultdict, deque
class Solution:
    def killProcess(self, pid: List[int], ppid: List[int], kill: int) -> List[int]:
        kids = defaultdict(list)
        for p, q in zip(pid, ppid):
            kids[q].append(p)
        ans = []
        dq = deque([kill])
        while dq:
            cur = dq.popleft()
            ans.append(cur)
            dq.extend(kids.get(cur, []))
        return ans
```
