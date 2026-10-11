## Approach

When the total is not divisible by the machine count, equal sharing is impossible. Otherwise each machine aims for the average load. Sweeping left to right, keep the cumulative surplus or deficit that must flow across the current boundary; each position's bottleneck is the larger of its own gap to the average and the absolute flow passing through. The overall answer is the worst bottleneck encountered.

## Complexity Analysis

- **Time Complexity:** O(n) for the total plus one sweep.
- **Space Complexity:** O(1) extra memory.

## Implementation

```python
from typing import List

class Solution:
    def findMinMoves(self, machines: List[int]) -> int:
        n = len(machines)
        total = sum(machines)
        if total % n != 0:
            return -1
        avg = total // n
        ans = 0
        balance = 0
        for x in machines:
            diff = x - avg
            balance += diff
            ans = max(ans, abs(balance), diff)
        return ans
```
