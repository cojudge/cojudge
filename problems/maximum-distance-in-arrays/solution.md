## Approach

Sweep the rows once while remembering the smallest seen opening value and the largest seen closing value. For each new row, its closing value against the running minimum and its opening value against the running maximum are the only candidates that can beat the answer while respecting the different-rows rule. Update the best, then fold the row endpoints into the running extremes. Sorted rows justify looking only at endpoints.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the row count.
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List
class Solution:
    def maxDistance(self, arrays: List[List[int]]) -> int:
        min_v = arrays[0][0]
        max_v = arrays[0][-1]
        ans = 0
        for arr in arrays[1:]:
            first, last = arr[0], arr[-1]
            ans = max(ans, abs(last - min_v), abs(max_v - first))
            min_v = min(min_v, first)
            max_v = max(max_v, last)
        return ans
```
