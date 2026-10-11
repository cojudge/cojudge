## Approach

Because the width is the smaller factor, it lies at or below the square root of the area. Starting from the floored square root and stepping downward, the first divisor encountered gives the largest feasible width, hence the closest-to-square pair. Dividing yields the matching length.

## Complexity Analysis

- **Time Complexity:** O(sqrt(area)) in the worst case, often much faster.
- **Space Complexity:** O(1).

## Implementation

```python
import math
from typing import List

class Solution:
    def constructRectangle(self, area: int) -> List[int]:
        w = int(math.isqrt(area))
        while area % w != 0:
            w -= 1
        return [area // w, w]
```
