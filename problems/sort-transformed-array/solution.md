## Approach

Evaluate the quadratic at both ends of the sorted input. The parabola opens
upward when `a >= 0`, so the larger end value belongs at the back of the
answer; it opens downward when `a < 0`, so the smaller end value belongs at
the front. Consuming one end per step keeps the whole pass linear.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the array length.
- **Space Complexity:** O(n) for the output (O(1) extra).

## Implementation

```python
from typing import List

class Solution:
    def sortTransformedArray(self, nums: List[int], a: int, b: int, c: int) -> List[int]:
        def f(x: int) -> int:
            return a * x * x + b * x + c
        n = len(nums)
        out = [0] * n
        l, r = 0, n - 1
        idx = n - 1 if a >= 0 else 0
        while l <= r:
            lv, rv = f(nums[l]), f(nums[r])
            if a >= 0:
                if lv >= rv:
                    out[idx] = lv
                    l += 1
                else:
                    out[idx] = rv
                    r -= 1
                idx -= 1
            else:
                if lv <= rv:
                    out[idx] = lv
                    l += 1
                else:
                    out[idx] = rv
                    r -= 1
                idx += 1
        return out
```
