## Approach

Find how many bits the input actually uses, then make a mask with that many low bits set. XOR-ing the input with the mask flips exactly the meaningful bits while leaving any higher zeroes untouched. Using a wider integer while building the mask keeps the shift safe near the 31-bit limit.

## Complexity Analysis

- **Time Complexity:** O(log num), one step per binary digit.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def findComplement(self, num: int) -> int:
        mask = 0
        t = num
        while t > 0:
            mask = (mask << 1) | 1
            t >>= 1
        return mask ^ num
```
