## Approach

Zero maps directly to `"0"`. Otherwise remember the sign and repeatedly take the remainder modulo seven, building digits from least to most significant. Reversing the collected digits and restoring the sign yields the base-seven text.

## Complexity Analysis

- **Time Complexity:** O(log_7 |num|) digit steps.
- **Space Complexity:** O(log_7 |num|) for the output.

## Implementation

```python
class Solution:
    def convertToBase7(self, num: int) -> str:
        if num == 0:
            return "0"
        neg = num < 0
        n = abs(num)
        ds = []
        while n > 0:
            ds.append(str(n % 7))
            n //= 7
        if neg:
            ds.append("-")
        return "".join(reversed(ds))
```
