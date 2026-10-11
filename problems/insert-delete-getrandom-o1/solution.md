## Approach

Store values in a dense list and remember each value's index in a hash map. Insertion appends a new value and records its slot; deletion swaps the target with the final entry, updates that entry's index, and pops the tail. Sampling draws a uniform list index. The judge accepts any current member for sampling steps.

## Complexity Analysis

- **Time Complexity:** O(1) average per operation.
- **Space Complexity:** O(n) for the list plus the index map.

## Implementation

```python
import random
from typing import List
class Solution:
    def runRandomizedSet(self, operations: List[str], values: List[int]) -> List[int]:
        arr = []
        pos = {}
        out = []
        for i in range(1, len(operations)):
            op = operations[i]
            if op == "insert":
                v = values[i]
                if v in pos:
                    out.append(0)
                else:
                    pos[v] = len(arr)
                    arr.append(v)
                    out.append(1)
            elif op == "remove":
                v = values[i]
                if v not in pos:
                    out.append(0)
                else:
                    idx = pos.pop(v)
                    last = arr.pop()
                    if idx < len(arr):
                        arr[idx] = last
                        pos[last] = idx
                    out.append(1)
            elif op == "getRandom":
                out.append(random.choice(arr))
        return out
```
