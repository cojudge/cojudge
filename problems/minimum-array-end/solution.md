## Approach

Every element of `nums` must keep all of the set bits of `x`, because the AND of the whole array equals `x`. The minimum possible last element is built by "merging" `x` with the counter value `n - 1`: keep the bits of `x`, then insert the bits of `n - 1` into the lowest free (zero) positions of `x`, least significant first.

Since the resulting value can exceed the 32-bit range (up to ~2^53 for the given constraints), it must be computed with 64-bit arithmetic.

## Complexity Analysis

- **Time Complexity:** O(1), bounded by the fixed bit width (at most ~64 iterations).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def minEnd(self, n: int, x: int) -> int:
        result = x
        remaining = n - 1
        bit = 1
        while remaining > 0:
            if (result & bit) == 0:
                result |= (remaining & 1) * bit
                remaining >>= 1
            bit <<= 1
        return result
```