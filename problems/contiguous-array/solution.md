## Approach

Treat every `0` as `-1` and every `1` as `+1`, turning a balanced slice into a subarray whose values sum to zero. A zero-sum subarray sits between two equal prefix totals, so scanning once while remembering the earliest index of each running total reveals the longest such slice. The map starts with total `0` at position `-1` so slices beginning at the front are covered.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `nums`.
- **Space Complexity:** O(n) for the first-occurrence map.

## Implementation

```python
from typing import List
class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        first = {0: -1}
        best = 0
        total = 0
        for i, v in enumerate(nums):
            total += 1 if v == 1 else -1
            if total in first:
                best = max(best, i - first[total])
            else:
                first[total] = i
        return best
```
