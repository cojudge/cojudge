## Approach

Walk through the bits from right to left, counting positions. Remember where the previous `1` was seen; each new `1` forms a gap with it, and the maximum over all such gaps is the answer. Numbers with zero or one `1` naturally yield zero.

## Complexity Analysis

- **Time Complexity:** O(log n), one step per binary digit.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def binaryGap(self, n: int) -> int:
        prev = -1
        best = 0
        idx = 0
        while n > 0:
            if n & 1:
                if prev != -1:
                    best = max(best, idx - prev)
                prev = idx
            n >>= 1
            idx += 1
        return best
```
