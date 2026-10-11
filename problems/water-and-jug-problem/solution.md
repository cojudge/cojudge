## Approach

Pouring preserves multiples of `gcd(x, y)`: every reachable combined total is
such a multiple, and every multiple between 0 and `x + y` is reachable. The
answer is therefore true exactly when the target fits in both jugs and passes
the divisibility test, with zero always reachable.

## Complexity Analysis

- **Time Complexity:** O(log(min(x, y))) for the GCD.
- **Space Complexity:** O(1).

## Implementation

```python
import math

class Solution:
    def canMeasureWater(self, x: int, y: int, target: int) -> bool:
        if target < 0:
            return False
        if target == 0:
            return True
        if x + y < target:
            return False
        if x == 0:
            return y == target
        if y == 0:
            return x == target
        return target % math.gcd(x, y) == 0
```
