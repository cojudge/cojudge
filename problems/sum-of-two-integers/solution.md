## Approach

Use bit manipulation: XOR computes the sum without carry, AND with left shift computes the carry. Repeat until carry is zero. A 32-bit mask handles Python's unbounded integers.

## Complexity Analysis

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        while b:
            a, b = (a ^ b) & mask, ((a & b) << 1) & mask
        return a if a < 0x80000000 else ~(a ^ mask)
```
