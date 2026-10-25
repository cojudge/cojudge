## Approach

Keep a running total starting at zero. Loop through every integer from 1 to n and add it to the total.

## Complexity Analysis

- **Time Complexity:** O(n).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def sumUpTo(self, n: int) -> int:
        total = 0
        for i in range(1, n + 1):
            total += i
        return total
```
