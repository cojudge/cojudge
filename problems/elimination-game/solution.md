## Approach

Instead of deleting entries, follow three numbers: the current head value, the spacing between consecutive survivors, and how many values remain. A left-to-right pass always advances the head by the spacing; a right-to-left pass advances it only when the remaining count is odd. Each pass halves the count and doubles the spacing while flipping direction, so the head converges to the survivor in logarithmic time.

## Complexity Analysis

- **Time Complexity:** O(log n), one iteration per halving of the row.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def lastRemaining(self, n: int) -> int:
        head = 1
        step = 1
        remaining = n
        left = True
        while remaining > 1:
            if left or remaining % 2 == 1:
                head += step
            remaining //= 2
            step *= 2
            left = not left
        return head
```
