## Approach

Translate each integer row into a lookup from employee id to its importance and subordinate list. Starting from the queried id, perform a stack-based traversal: pop an id, add its importance, and push every unvisited subordinate. Each reachable person is counted once, which naturally includes indirect reports.

## Complexity Analysis

- **Time Complexity:** O(n + e), where n is the employee count and e the total reporting edges.
- **Space Complexity:** O(n + e) for the map plus the traversal stack.

## Implementation

```python
from typing import List
class Solution:
    def getImportance(self, employees: List[List[int]], id: int) -> int:
        by_id = {r[0]: r for r in employees}
        total = 0
        stack = [id]
        seen = {id}
        while stack:
            cur = stack.pop()
            row = by_id.get(cur)
            if not row:
                continue
            total += row[1]
            for s in row[2:]:
                if s not in seen:
                    seen.add(s)
                    stack.append(s)
        return total
```
