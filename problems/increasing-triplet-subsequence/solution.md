## Approach

Sweep once while remembering two thresholds: the lowest value observed and the lowest second-step value above it. Each new number either lowers the first threshold, sets or lowers the second threshold, or exceeds both — the last case proves a rising triple ends here. This keeps only constant state yet detects any valid pattern.

## Complexity Analysis

- **Time Complexity:** O(n), a single pass over the list.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
from typing import List
class Solution:
    def increasingTriplet(self, nums: List[int]) -> bool:
        first = second = float("inf")
        for x in nums:
            if x <= first:
                first = x
            elif x <= second:
                second = x
            else:
                return True
        return False
```
