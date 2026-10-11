## Approach

Walk the string pulling optional signs and numerator/denominator pairs. Merge each term into a running total with cross multiplication and divide by the gcd each time so numbers stay small.

## Complexity Analysis

- **Time Complexity:** O(k log C) for k fractions.
- **Space Complexity:** O(1).

## Implementation

```python
import math
class Solution:
    def fractionAddition(self, expression: str) -> str:
        rn, rd, i, n = 0, 1, 0, len(expression)
        while i < n:
            sign = 1
            if expression[i] in '+-':
                sign = -1 if expression[i] == '-' else 1
                i += 1
            j = i
            while j < n and expression[j].isdigit():
                j += 1
            a = int(expression[i:j]) * sign
            i = j + 1
            j = i
            while j < n and expression[j].isdigit():
                j += 1
            b = int(expression[i:j])
            i = j
            rn = rn * b + a * rd
            rd = rd * b
            g = math.gcd(abs(rn), rd)
            rn //= g; rd //= g
        return f"{rn}/{rd}"
```
