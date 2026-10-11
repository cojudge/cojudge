## Approach

Fix the number of digits k. The leading digit offers 9 options and each later
position offers one fewer remaining digit, giving `9 * 9 * 8 * ...` for that
length. Summing these counts for lengths 1 through n, plus one for zero,
yields the answer.

## Complexity Analysis

- **Time Complexity:** O(n) with n at most 8.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def countNumbersWithUniqueDigits(self, n: int) -> int:
        if n == 0:
            return 1
        if n == 1:
            return 10
        total = 10
        prod = 9
        for i in range(2, min(n, 10) + 1):
            prod *= 11 - i
            total += prod
        return total
```
