## Approach

Decode each flattened row into its [start,end] pairs and pool everything into one list. Sort by start time, then sweep while tracking the farthest busy end. Whenever the next start lies strictly past that end, the stretch between them is shared free time; otherwise extend the busy cover. This yields gaps in order with no extra merging pass.

## Complexity Analysis

- **Time Complexity:** O(T log T), where T is the total number of busy pairs, dominated by sorting.
- **Space Complexity:** O(T) for the pooled intervals plus the output.

## Implementation

```python
from typing import List
class Solution:
    def employeeFreeTime(self, schedule: List[List[int]]) -> List[List[int]]:
        alls = []
        for emp in schedule:
            for i in range(0, len(emp) - 1, 2):
                alls.append([emp[i], emp[i + 1]])
        alls.sort()
        res = []
        if not alls:
            return res
        prev = alls[0][1]
        for s, e in alls[1:]:
            if s > prev:
                res.append([prev, s])
                prev = e
            else:
                prev = max(prev, e)
        return res
```
