## Approach

Walk both lists with two indices and a toggle. On each step take from the toggled list when it still has items, otherwise take from the other list, then flip the toggle until both lists are drained.

## Complexity Analysis

- **Time Complexity:** O(n + m)
- **Space Complexity:** O(n + m) for the output.

## Implementation

```python
from typing import List
class Solution:
    def zigzagIterate(self, v1: List[int], v2: List[int]) -> List[int]:
        res, i, j, take_first = [], 0, 0, True
        while i < len(v1) or j < len(v2):
            if take_first:
                if i < len(v1):
                    res.append(v1[i]); i += 1
                else:
                    res.append(v2[j]); j += 1
            else:
                if j < len(v2):
                    res.append(v2[j]); j += 1
                else:
                    res.append(v1[i]); i += 1
            take_first = not take_first
        return res
```
