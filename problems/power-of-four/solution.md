## Approach

A power of four must be positive and hold exactly one binary 1, which the classic `n & (n-1)` test confirms. Among powers of two, only those with the lone bit in an even slot (values 1, 4, 16, ...) are powers of four; these are precisely the powers of two one less than a multiple of three. Combining the three checks decides membership in constant time.

## Complexity Analysis

- **Time Complexity:** O(1).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0 and (n - 1) % 3 == 0
```
