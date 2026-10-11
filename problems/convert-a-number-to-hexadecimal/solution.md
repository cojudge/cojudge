## Approach

Zero returns immediately. Otherwise the signed value is masked into an unsigned 32-bit range, which automatically gives the two's complement pattern for negatives. Repeatedly taking the lowest four bits yields one hex digit at a time from least to most significant; reversing the collected digits drops all leading zeros.

## Complexity Analysis

- **Time Complexity:** O(1), at most eight hex digits.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def toHex(self, num: int) -> str:
        if num == 0:
            return "0"
        dig = "0123456789abcdef"
        v = num & 0xFFFFFFFF
        out = []
        while v != 0:
            out.append(dig[v & 0xF])
            v >>= 4
        return "".join(reversed(out))
```
