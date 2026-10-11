## Approach

Convert blooms to `days[position]`. A pair of positions `l` and `r = l+k+1` is valid on day `max(days[l], days[r])` exactly when every slot between them blooms later. Scan with a sliding window: if an interior slot blooms earlier, jump the window past it; otherwise record the candidate and slide forward.

## Complexity Analysis

- **Time Complexity:** O(n), each position visited at most twice.
- **Space Complexity:** O(n) for the days array.

## Implementation

```python
from typing import List
class Solution:
    def kEmptySlots(self, bulbs: List[int], k: int) -> int:
        n = len(bulbs)
        days = [0] * (n + 1)
        for d, b in enumerate(bulbs, start=1):
            days[b] = d
        ans = float("inf")
        left = 1
        right = left + k + 1
        i = left + 1
        while right <= n:
            if i > right - 1:
                ans = min(ans, max(days[left], days[right]))
                left = right
                right = left + k + 1
                i = left + 1
            elif days[i] < max(days[left], days[right]):
                left = i
                right = left + k + 1
                i = left + 1
            else:
                i += 1
        return -1 if ans == float("inf") else ans
```
