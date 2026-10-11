## Approach

Peel off bits from the right. Remember the lowest bit, shift once, and require every new lowest bit to differ from the remembered one. A single repeated adjacent pair disproves the property; surviving the whole scan proves alternation.

## Complexity Analysis

- **Time Complexity:** O(log n), one step per bit.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def hasAlternatingBits(self, n: int) -> bool:
        prev = n & 1
        n >>= 1
        while n:
            cur = n & 1
            if cur == prev:
                return False
            prev = cur
            n >>= 1
        return True
```
