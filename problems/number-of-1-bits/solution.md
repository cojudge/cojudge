## Approach

Iterate through each bit of the input integer, checking if the least significant bit is set using `n & 1`, then shift right. Count the number of set bits.

## Complexity Analysis

- **Time Complexity:** O(k) where k is the number of bits
- **Space Complexity:** O(1)

## Implementation

```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        cnt = 0
        while n:
            cnt += n & 1
            n >>= 1
        return cnt
```
