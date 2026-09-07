## Approach

For any two numbers `left <= right`, the AND of the whole range equals the common prefix of their binary representations with all trailing bits zeroed. Any differing low bit flips at least once inside the range, so those bits AND to 0. Shift both numbers right until they become equal, counting the shifts, then shift the surviving common prefix back left by that count.

## Complexity Analysis

- **Time Complexity:** O(1), at most 32 iterations for 32-bit integers.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left < right:
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift
```