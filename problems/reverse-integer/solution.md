## Approach

Record the sign and repeatedly remove the last digit from the input magnitude. Append each removed digit to the reversed value with multiplication by `10`. Restore the sign and return `0` if the result is outside the signed 32-bit range.

## Complexity Analysis

- **Time Complexity:** O(log |x|), because one decimal digit is processed per iteration.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        value = abs(x)
        result = 0
        while value > 0:
            result = result * 10 + value % 10
            value //= 10
        result *= sign
        return result if -(2**31) <= result <= 2**31 - 1 else 0
```
