## Approach

Skip leading blanks, then consume one optional sign character, then accumulate consecutive digits into a running total. Parsing halts at the first non-digit, and when no digits appear the result is zero. A 64-bit accumulator lets us detect when the magnitude passes the 32-bit limits so we can clamp to `INT_MAX` or `INT_MIN`.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each character is examined at most once.
- **Space Complexity:** O(1) extra space.

## Implementation

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        i, n = 0, len(s)
        while i < n and s[i] == ' ':
            i += 1
        sign = 1
        if i < n and s[i] in ('+', '-'):
            if s[i] == '-':
                sign = -1
            i += 1
        val = 0
        while i < n and s[i].isdigit():
            val = val * 10 + int(s[i])
            if sign == 1 and val > 2**31 - 1:
                return 2**31 - 1
            if sign == -1 and val > 2**31:
                return -(2**31)
            i += 1
        return sign * val
```
