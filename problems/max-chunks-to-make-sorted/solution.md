## Approach

Since the array is a permutation of 0 through n-1, the set {arr[0..i]} equals {0..i} exactly when the maximum of that prefix is i. Scanning once while remembering the running maximum lets us cut after every index satisfying that equality, which yields the finest feasible partition.

## Complexity Analysis

- **Time Complexity:** O(n) for a single pass.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List
class Solution:
    def maxChunksToSorted(self, arr: List[int]) -> int:
        chunks = 0
        mx = -1
        for i, x in enumerate(arr):
            mx = max(mx, x)
            if mx == i:
                chunks += 1
        return chunks
```
