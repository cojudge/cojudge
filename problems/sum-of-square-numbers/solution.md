## Approach

Pin one root at 0 and the other at the integer square root of c, then squeeze inward: the square sum grows when the low end rises and shrinks when the high end falls, so step the side indicated by the comparison with c. Meeting in the middle without a hit proves impossibility.

## Complexity Analysis

- **Time Complexity:** O(sqrt(c)) steps.
- **Space Complexity:** O(1).

## Implementation

```python
import math
class Solution:
    def judgeSquareSum(self, c: int) -> bool:
        l, r = 0, math.isqrt(c)
        while l <= r:
            s = l * l + r * r
            if s == c:
                return True
            if s < c:
                l += 1
            else:
                r -= 1
        return False
```
