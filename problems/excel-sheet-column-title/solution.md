## Approach

Repeatedly peel off the least-significant letter of the title using `(columnNumber - 1) % 26`, since the alphabet is 1-based (`A` = 1 ... `Z` = 26). Pre-decrementing `columnNumber` avoids an off-by-one where `26` would otherwise map outside the alphabet. Build the result from right to left and reverse it at the end.

## Complexity Analysis

- **Time Complexity:** O(log_26(columnNumber)), since `columnNumber` is divided by 26 each iteration.
- **Space Complexity:** O(log_26(columnNumber)) for the output string.

## Implementation

```python
class Solution:
    def convertToTitle(self, columnNumber: int) -> str:
        result = []
        while columnNumber > 0:
            columnNumber -= 1
            result.append(chr(ord('A') + columnNumber % 26))
            columnNumber //= 26
        return ''.join(reversed(result))
```