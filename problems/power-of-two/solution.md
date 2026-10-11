## Approach

A positive integer is a power of two exactly when its binary form contains a single set bit. Clearing the lowest set bit with `n & (n - 1)` leaves zero only in that case. Non-positive inputs can never qualify, so they return `False` immediately.

## Complexity Analysis

- **Time Complexity:** O(1), a constant number of bit operations.
- **Space Complexity:** O(1), no extra storage.

## Implementation

```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
```
