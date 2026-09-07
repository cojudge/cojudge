## Approach

Walk the string from left to right while tracking each symbol's value. Whenever the current symbol is smaller than the symbol to its right (e.g. `I` before `V`), it contributes a negative value; otherwise it contributes positively.

## Complexity Analysis

- **Time Complexity:** O(n), where `n` is the length of `s`. Each symbol is examined once.
- **Space Complexity:** O(1), aside from the fixed-size lookup table.

## Implementation

```python
class Solution:
    def romanToInt(self, s: str) -> int:
        values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
        total = 0
        for i, ch in enumerate(s):
            value = values[ch]
            if i + 1 < len(s) and value < values[s[i + 1]]:
                total -= value
            else:
                total += value
        return total
```