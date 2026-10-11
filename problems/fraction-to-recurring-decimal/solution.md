## Approach

Separate the sign, then do long division digit by digit. Remember where each remainder first appeared: when a remainder repeats, everything produced since its first visit repeats forever, so wrap that block in parentheses. A zero remainder ends the decimal. Wide integers protect the edge case of the smallest 32-bit value.

## Complexity Analysis

- **Time Complexity:** O(d), where d is the number of digits before the decimal terminates or repeats (bounded by the denominator).
- **Space Complexity:** O(d) for the remainder positions and the output.

## Implementation

```python
class Solution:
    def fractionToDecimal(self, numerator: int, denominator: int) -> str:
        if numerator == 0:
            return "0"
        res = []
        if (numerator < 0) ^ (denominator < 0):
            res.append("-")
        num, den = abs(numerator), abs(denominator)
        res.append(str(num // den))
        rem = num % den
        if rem == 0:
            return "".join(res)
        res.append(".")
        pos = {}
        while rem != 0:
            if rem in pos:
                at = pos[rem]
                res.insert(at, "(")
                res.append(")")
                break
            pos[rem] = len(res)
            rem *= 10
            res.append(str(rem // den))
            rem %= den
        return "".join(res)
```
