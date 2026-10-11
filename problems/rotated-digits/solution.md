## Approach

Inspect every integer from `1` to `n` one decimal digit at a time. Discard
the number if any digit is `3`, `4`, or `7`, since those have no rotated
form. Otherwise mark the number good when at least one digit belongs to the
changing set `2, 5, 6, 9`. Counting the good numbers gives the answer.

## Complexity Analysis

- **Time Complexity:** O(n log n), since each of the n values contributes its decimal digits.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def rotatedDigits(self, n: int) -> int:
        count = 0
        for x in range(1, n + 1):
            changed = False
            valid = True
            v = x
            while v > 0:
                d = v % 10
                if d in (3, 4, 7):
                    valid = False
                    break
                if d in (2, 5, 6, 9):
                    changed = True
                v //= 10
            if valid and changed:
                count += 1
        return count
```
