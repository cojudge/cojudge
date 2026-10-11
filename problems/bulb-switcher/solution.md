## Approach

Lamp `p` is toggled once for every divisor of `p`. Divisors pair up, except when `p` is a perfect square, which has an odd count. Hence exactly the square-numbered lamps finish on, and the answer is the count of squares not exceeding `n`.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
import math
class Solution:
    def bulbSwitch(self, n: int) -> int:
        return int(math.isqrt(n))
```
