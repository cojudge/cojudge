## Approach

Return one when the exponent reaches zero. Otherwise peel off one multiplication and recurse on the smaller exponent.

## Complexity Analysis

- **Time Complexity:** O(exp).
- **Space Complexity:** O(exp).

## Implementation

```python
class Solution:
    def powerRec(self, base: int, exp: int) -> int:
        if exp == 0:
            return 1
        return base * self.powerRec(base, exp - 1)
```
