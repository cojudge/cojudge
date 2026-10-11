## Approach

Hold every copy in a list and, for each distinct value, the set of list positions containing it. Appending handles insertion; deletion moves the tail element into the removed slot and patches both position sets. Sampling reads a uniform list slot, and the judge accepts any value with a live copy.

## Complexity Analysis

- **Time Complexity:** O(1) average per operation.
- **Space Complexity:** O(n) for the copies plus the position sets.

## Implementation

```python
import random
from typing import List
class Solution:
    def runRandomizedCollection(self, operations: List[str], values: List[int]) -> List[int]:
        arr = []
        idx = {}
        out = []
        for i in range(1, len(operations)):
            op = operations[i]
            if op == "insert":
                v = values[i]
                out.append(0 if v in idx and idx[v] else 1)
                idx.setdefault(v, set()).add(len(arr))
                arr.append(v)
            elif op == "remove":
                v = values[i]
                if v not in idx or not idx[v]:
                    out.append(0)
                else:
                    j = idx[v].pop()
                    last = arr[-1]
                    arr[j], arr[-1] = arr[-1], arr[j]
                    if j != len(arr) - 1:
                        idx[last].discard(len(arr) - 1)
                        idx[last].add(j)
                    arr.pop()
                    if not idx[v]:
                        del idx[v]
                    out.append(1)
            elif op == "getRandom":
                out.append(random.choice(arr))
        return out
```
