## Approach

Return single digits directly. Otherwise split off the last digit and add it to the recursive sum of the remaining prefix.

## Complexity Analysis

- **Time Complexity:** O(log n).
- **Space Complexity:** O(log n).

## Implementation

```python
class Solution:
    def sumDigitsRec(self, n: int) -> int:
        if n < 10:
            return n
        return n % 10 + self.sumDigitsRec(n // 10)
```
