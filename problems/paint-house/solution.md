## Approach

Keep three running totals for the cheapest cost ending with red, blue, or green after each house. For the next house, each new total adds its painting cost to the smaller of the two totals that used a different color before. After the last house the answer is the smallest of the three totals.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of houses.
- **Space Complexity:** O(1) besides the input.

## Implementation

```python
from typing import List

class Solution:
    def minCost(self, costs: List[List[int]]) -> int:
        r = b = g = 0
        for c in costs:
            r, b, g = c[0] + min(b, g), c[1] + min(r, g), c[2] + min(r, b)
        return min(r, b, g)
```
