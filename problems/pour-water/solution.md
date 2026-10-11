## Approach

Pour units one by one. For each unit, scan left while levels never rise, remembering the lowest reachable column; if it sits below the drop column, place the water there. Otherwise repeat the scan to the right. When neither side improves, raise the drop column itself. Updating levels immediately keeps later units aware of earlier ones.

## Complexity Analysis

- **Time Complexity:** O(volume * n), where n is the terrain length, since each unit scans at most the whole array twice.
- **Space Complexity:** O(1) besides the input array.

## Implementation

```python
from typing import List
class Solution:
    def pourWater(self, heights: List[int], volume: int, k: int) -> List[int]:
        n = len(heights)
        for _ in range(volume):
            best = k
            for i in range(k - 1, -1, -1):
                if heights[i] > heights[best]:
                    break
                if heights[i] < heights[best]:
                    best = i
            if best != k:
                heights[best] += 1
                continue
            best = k
            for i in range(k + 1, n):
                if heights[i] > heights[best]:
                    break
                if heights[i] < heights[best]:
                    best = i
            heights[best] += 1
        return heights
```
