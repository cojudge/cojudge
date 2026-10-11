## Approach

Count how many multiples of 5, 25, 125, and so on lie at or below `n`. Each multiple contributes one factor of 5 per power dividing it, and those factors pair with abundant factors of 2 to make trailing zeros. Repeated integer division by 5 accumulates exactly this count.

## Complexity Analysis

- **Time Complexity:** O(log n), dividing by 5 each step.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def trailingZeroes(self, n: int) -> int:
        res = 0
        while n > 0:
            n //= 5
            res += n
        return res
```
