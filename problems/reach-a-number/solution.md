## Approach

Replace the target by its absolute value since left-right symmetry makes the sign irrelevant. Accumulate triangular sums 1, 3, 6, 10, ... until reaching at least the distance. Reversing a step of size x shifts the reachable total by 2*x, so the gap between the sum and the distance must be even; otherwise extend by one or two moves until parity matches.

## Complexity Analysis

- **Time Complexity:** O(sqrt(|target|)), for growing n until the triangular sum covers the distance.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def reachNumber(self, target: int) -> int:
        t = abs(target)
        n = 0
        while True:
            n += 1
            s = n * (n + 1) // 2
            if s >= t and (s - t) % 2 == 0:
                return n
```
