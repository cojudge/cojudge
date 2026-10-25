## Approach

Peel off the last digit with modulo ten, add it to a running total, then drop it with integer division. Repeat until no digits remain.

## Complexity Analysis

- **Time Complexity:** O(log n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def sumOfDigits(self, n: int) -> int:
        total = 0
        while n > 0:
            total += n % 10
            n //= 10
        return total
```
