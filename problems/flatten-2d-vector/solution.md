## Approach

Flatten the 2D input once into a single list, skipping empty rows. Keep an index pointing at the next unconsumed value. A `next` operation returns the value at the index and advances it, while a `hasNext` operation reports whether the index is still inside the list. This replays the iterator behavior without storing per-row cursors.

## Complexity Analysis

- **Time Complexity:** O(m + q), where m is the total number of integers and q is the number of operations.
- **Space Complexity:** O(m) for the flattened list and the output.

## Implementation

```python
from typing import List

class Solution:
    def runVector2D(self, vec: List[List[int]], operations: List[str]) -> List[int]:
        flat = [v for row in vec for v in row]
        ans = []
        idx = 0
        for op in operations:
            if op == "next":
                ans.append(flat[idx])
                idx += 1
            else:
                ans.append(1 if idx < len(flat) else 0)
        return ans
```
