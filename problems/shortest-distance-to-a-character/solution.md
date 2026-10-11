## Approach

Do two linear sweeps. Left to right, remember the most recent index holding the target and record the gap. Right to left, remember the next such index and keep the smaller of the two gaps. Both passes are needed because the nearest match may lie on either side.

## Complexity Analysis

- **Time Complexity:** O(n) for string length n.
- **Space Complexity:** O(n) for the answer array (O(1) extra).

## Implementation

```python
from typing import List
class Solution:
    def shortestToChar(self, s: str, c: str) -> List[int]:
        t = c[0]
        n = len(s)
        ans = [0] * n
        prev = -10 ** 9
        for i, ch in enumerate(s):
            if ch == t:
                prev = i
            ans[i] = i - prev
        nxt = 10 ** 9
        for i in range(n - 1, -1, -1):
            if s[i] == t:
                nxt = i
            ans[i] = min(ans[i], nxt - i)
        return ans
```
