## Approach

Convert the dotted address to a 32-bit integer. While addresses remain, compute two limits: the alignment limit from the lowest set bit of the current start, and the size limit from the largest power of two not exceeding the remainder. Take the smaller as the next block size, translate it to a prefix length, emit the block, and advance. Both limits guarantee validity and greediness yields the fewest blocks.

## Complexity Analysis

- **Time Complexity:** O(n) in the worst case, but at most O(log MaxIP + number of blocks) steps since each block at least halves alignment or remainder effects; with n <= 1000 it is tiny.
- **Space Complexity:** O(1) besides the output list.

## Implementation

```python
from typing import List
class Solution:
    def ipToCIDR(self, ip: str, n: int) -> List[str]:
        parts = list(map(int, ip.split('.')))
        start = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
        ans = []
        def to_ip(v):
            return f"{(v >> 24) & 255}.{(v >> 16) & 255}.{(v >> 8) & 255}.{v & 255}"
        while n > 0:
            low = start & -start if start != 0 else 1 << 32
            mx = 1 << (n.bit_length() - 1)
            step = low if low < mx else mx
            import math
            prefix = 32 - (step.bit_length() - 1)
            ans.append(f"{to_ip(start)}/{prefix}")
            start += step
            n -= step
        return ans
```
