## Approach

Iterate 32 times, shifting the result left and adding the least significant bit of n, then shifting n right.

## Complexity Analysis

- **Time Complexity:** O(1)
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def reverseBits(self, n: int) -> int:
        res = 0
        for _ in range(32):
            res = (res << 1) | (n & 1)
            n >>= 1
        return res
```
