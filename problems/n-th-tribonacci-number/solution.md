## Approach

Iterate from the base cases `T(0) = 0`, `T(1) = 1`, `T(2) = 1`, keeping only the last three values and applying `T(n) = T(n-1) + T(n-2) + T(n-3)`.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def tribonacci(self, n: int) -> int:
        if n == 0:
            return 0
        if n <= 2:
            return 1
        a, b, c = 0, 1, 1
        for _ in range(3, n + 1):
            a, b, c = b, c, a + b + c
        return c
```
