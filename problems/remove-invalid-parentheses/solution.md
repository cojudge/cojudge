## Approach

Breadth-first search over strings formed by deleting one bracket at a time; the first level containing any balanced string holds exactly the minimum-deletion answers.

## Complexity Analysis

- **Time Complexity:** O(2^n)
- **Space Complexity:** O(2^n)

## Implementation

```python
from typing import List
from collections import deque
class Solution:
    def removeInvalidParentheses(self, s: str) -> List[str]:
        def valid(t: str) -> bool:
            bal = 0
            for c in t:
                if c == '(':
                    bal += 1
                elif c == ')':
                    bal -= 1
                    if bal < 0:
                        return False
            return bal == 0
        seen, q, res = {s}, deque([s]), []
        while q:
            for _ in range(len(q)):
                cur = q.popleft()
                if valid(cur):
                    res.append(cur)
                elif not res:
                    for i, c in enumerate(cur):
                        if c not in '()':
                            continue
                        if i and cur[i] == cur[i - 1]:
                            continue
                        nxt = cur[:i] + cur[i + 1:]
                        if nxt not in seen:
                            seen.add(nxt)
                            q.append(nxt)
            if res:
                break
        return res
```
