## Approach

Binary search candidate roots from 1 to `num / 2`, squaring each midpoint with
64-bit arithmetic so large inputs cannot overflow. An exact hit means the
number is a perfect square; exhausting the range means it is not.

## Complexity Analysis

- **Time Complexity:** O(log num).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isPerfectSquare(self, num: int) -> bool:
        if num < 1:
            return False
        if num == 1:
            return True
        lo, hi = 1, num // 2
        while lo <= hi:
            mid = (lo + hi) // 2
            sq = mid * mid
            if sq == num:
                return True
            if sq < num:
                lo = mid + 1
            else:
                hi = mid - 1
        return False
```
