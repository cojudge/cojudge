## Approach

Stop the recursion at zero or one by returning one. For larger inputs multiply n by the result of the same function on n minus one.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(n).

## Implementation

```python
class Solution:
    def factorialRec(self, n: int) -> int:
        if n <= 1:
            return 1
        return n * self.factorialRec(n - 1)
```
