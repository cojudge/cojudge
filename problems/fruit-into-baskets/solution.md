## Approach

Maintain a sliding window that never holds more than two fruit kinds. Expand the right edge one tree at a time while tallying kinds in a map; whenever a third kind appears, shift the left edge forward, decrementing counts until the window is legal again. The maximum window length encountered is the answer.

## Complexity Analysis

- **Time Complexity:** O(n) since each index moves at most once.
- **Space Complexity:** O(1) for the at-most-two-entry map.

## Implementation

```python
from typing import List
class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        cnt = {}
        left = best = 0
        for right, v in enumerate(fruits):
            cnt[v] = cnt.get(v, 0) + 1
            while len(cnt) > 2:
                u = fruits[left]
                cnt[u] -= 1
                if cnt[u] == 0:
                    del cnt[u]
                left += 1
            best = max(best, right - left + 1)
        return best
```
