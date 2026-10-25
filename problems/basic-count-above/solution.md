## Approach

Scan the array counting each element that is strictly larger than the threshold.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
from typing import List

class Solution:
    def countAbove(self, nums: List[int], t: int) -> int:
        count = 0
        for x in nums:
            if x > t:
                count += 1
        return count
```
