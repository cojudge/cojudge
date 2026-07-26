## Approach

Parse the portable string base as a double and use exponentiation by squaring. For a negative exponent, invert the base and negate the exponent before repeatedly consuming one binary exponent bit. Format the final double with 17 significant digits so the returned string round-trips reliably through a double parser.

## Complexity Analysis

- **Time Complexity:** O(log |n|), because each iteration halves the exponent.
- **Space Complexity:** O(1), excluding the returned decimal string.

## Implementation

```python
class Solution:
    def myPow(self, x: str, n: int) -> str:
        base = float(x)
        exponent = n
        if exponent < 0:
            base = 1.0 / base
            exponent = -exponent

        result = 1.0
        while exponent > 0:
            if exponent % 2 == 1:
                result *= base
            base *= base
            exponent //= 2
        return format(result, ".17g")
```
