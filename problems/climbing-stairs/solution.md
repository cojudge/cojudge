## Approach

Classic DP where the number of ways to reach step i is the sum of ways to reach steps i-1 and i-2 (fibonacci pattern).

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b
```
