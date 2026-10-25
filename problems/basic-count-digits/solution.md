## Approach

Treat zero as a special case returning one. Otherwise divide by ten in a loop, counting each division until nothing remains.

## Complexity Analysis

- **Time Complexity:** O(log n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def countDigits(self, n: int) -> int:
        if n == 0:
            return 1
        count = 0
        while n > 0:
            count += 1
            n //= 10
        return count
```
