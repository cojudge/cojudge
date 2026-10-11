## Approach

Treat the single overflowing case (`MIN_VALUE / -1`) separately by returning `MAX_VALUE`. Otherwise work with non-negative 64-bit copies, repeatedly carving off the biggest doubled multiple of the divisor that still fits into the remainder. Each carve adds the matching power of two to the quotient, and the sign is applied once at the end.

## Complexity Analysis

- **Time Complexity:** O(log^2 n) in the worst case, effectively O(log n) doublings per subtraction round.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def divide(self, dividend: int, divisor: int) -> int:
        if dividend == -(2**31) and divisor == -1:
            return 2**31 - 1
        neg = (dividend < 0) != (divisor < 0)
        a, b = abs(dividend), abs(divisor)
        q = 0
        while a >= b:
            chunk, mult = b, 1
            while a >= (chunk << 1):
                chunk <<= 1
                mult <<= 1
            a -= chunk
            q += mult
        return -q if neg else q
```
