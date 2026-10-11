## Approach

Scan the decimal positions from right to left with a place factor of 1, 10, 100, and so on. At each position, divide `n` into the higher part, the current digit, and the lower part. Positions with a current digit of 0 contribute only the complete cycles before them, a current digit of 1 adds one partial cycle covering the lower part, and larger digits add a full extra cycle.

## Complexity Analysis

- **Time Complexity:** O(log n), one step per decimal digit.
- **Space Complexity:** O(1), only a few counters.

## Implementation

```python
class Solution:
    def countDigitOne(self, n: int) -> int:
        count = 0
        factor = 1
        while factor <= n:
            lower = n % factor
            cur = (n // factor) % 10
            higher = n // (factor * 10)
            if cur == 0:
                count += higher * factor
            elif cur == 1:
                count += higher * factor + lower + 1
            else:
                count += (higher + 1) * factor
            factor *= 10
        return count
```
