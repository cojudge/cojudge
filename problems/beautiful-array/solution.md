## Approach

Odds and evens separate beautifully: an arithmetic progression cannot straddle the parity split in the middle position. Start from `[1]` and repeatedly replace each value by its odd and even children (`2*x-1` then `2*x`), keeping only values up to `n`. Odds come first, evens after, preserving beauty inductively.

## Complexity Analysis

- **Time Complexity:** O(n log n) to build the permutation by repeated doubling and filtering.
- **Space Complexity:** O(n) for the current list.

## Implementation

```python
from typing import List
class Solution:
    def beautifulArray(self, n: int) -> List[int]:
        cur = [1]
        while len(cur) < n:
            nxt = []
            for x in cur:
                v = 2 * x - 1
                if v <= n:
                    nxt.append(v)
            for x in cur:
                v = 2 * x
                if v <= n:
                    nxt.append(v)
            cur = nxt
        return cur[:n]
```
