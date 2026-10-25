## Approach

Stop at one with zero steps. Otherwise take one Collatz move and add one to the recursive count for the resulting value.

## Complexity Analysis

- **Time Complexity:** O(steps).
- **Space Complexity:** O(steps).

## Implementation

```python
class Solution:
    def collatzSteps(self, n: int) -> int:
        if n == 1:
            return 0
        if n % 2 == 0:
            return 1 + self.collatzSteps(n // 2)
        return 1 + self.collatzSteps(3 * n + 1)
```
