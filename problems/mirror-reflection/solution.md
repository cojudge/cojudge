## Approach

Imagine mirroring the room instead of bouncing the ray, so the beam travels straight through a grid of copies. The first corner hit occurs at the least common multiple of `p` and `q`. Removing shared factors of two reveals whether the number of room widths or heights crossed is even or odd, which directly identifies sensor 2, 0, or 1.

## Complexity Analysis

- **Time Complexity:** O(log(min(p, q))) for the factor-removal loop.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def mirrorReflection(self, p: int, q: int) -> int:
        while p % 2 == 0 and q % 2 == 0:
            p //= 2
            q //= 2
        if p % 2 == 0:
            return 2
        if q % 2 == 0:
            return 0
        return 1
```
