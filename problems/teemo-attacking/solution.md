## Approach

Because attacks are ordered, poison intervals can only overlap with their immediate neighbor. Walking once through the list adds the overlap-capped gap `min(duration, next - current)` for every adjacent pair, plus a full `duration` for the last attack. A zero duration short-circuits to zero.

## Complexity Analysis

- **Time Complexity:** O(n) for a single pass over the attacks.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def findPoisonedDuration(self, timeSeries: List[int], duration: int) -> int:
        if not timeSeries or duration <= 0:
            return 0
        total = 0
        for i in range(len(timeSeries) - 1):
            total += min(duration, timeSeries[i + 1] - timeSeries[i])
        return total + duration
```
