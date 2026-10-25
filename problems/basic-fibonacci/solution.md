## Approach

Return the base values directly for inputs zero and one. For larger inputs return the sum of the two preceding Fibonacci calls.

## Complexity Analysis

- **Time Complexity:** O(2^n).
- **Space Complexity:** O(n).

## Implementation

```python
class Solution:
    def fibonacci(self, n: int) -> int:
        if n == 0:
            return 0
        if n == 1:
            return 1
        return self.fibonacci(n - 1) + self.fibonacci(n - 2)
```
