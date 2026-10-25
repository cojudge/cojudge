## Approach

Scan every number from 1 to n. Whenever the number is divisible by k, add it to a running total.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def sumMultiples(self, n: int, k: int) -> int:
        total = 0
        for i in range(1, n + 1):
            if i % k == 0:
                total += i
        return total
```
