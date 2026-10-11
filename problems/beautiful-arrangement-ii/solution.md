## Approach

Reserve the first `k + 1` slots for zigzagging between a rising low pointer and a falling high pointer starting at 1 and `k + 1`. Consecutive gaps then sweep through `k, k-1, ..., 1`. Fill the remaining slots with `k+2 .. n` in order, which only reuses gap 1. The result permutes `1..n` with exactly `k` distinct gaps.

## Complexity Analysis

- **Time Complexity:** O(n) to emit the list.
- **Space Complexity:** O(n) for the answer.

## Implementation

```python
from typing import List
class Solution:
    def constructArray(self, n: int, k: int) -> List[int]:
        ans = []
        lo, hi = 1, k + 1
        while lo <= hi:
            ans.append(lo)
            lo += 1
            if lo <= hi:
                ans.append(hi)
                hi -= 1
        for v in range(k + 2, n + 1):
            ans.append(v)
        return ans
```
