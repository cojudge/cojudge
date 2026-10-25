## Approach

Use an outer loop for the row number and an inner loop adding that row's values. Accumulate all rows into a single total.

## Complexity Analysis

- **Time Complexity:** O(n^2).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def triangleSum(self, n: int) -> int:
        total = 0
        for i in range(1, n + 1):
            for j in range(1, i + 1):
                total += j
        return total
```
