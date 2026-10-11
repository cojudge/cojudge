## Approach

The zero count of `x!` is the sum of `floor(x/5^i)` over all powers of
five, which grows monotonically. Binary-search the smallest `x` whose count
reaches at least `k`. When that position yields exactly `k`, the five values
from the block start through the next multiple-of-five boundary all share
it; otherwise `k` is skipped and the answer is zero.

## Complexity Analysis

- **Time Complexity:** O(log k) search steps, each evaluating the zero sum in O(log x).
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def preimageSizeFZF(self, k: int) -> int:
        def zeros(x: int) -> int:
            total = 0
            while x:
                x //= 5
                total += x
            return total

        lo, hi = 0, 5 * (k + 1)
        while lo < hi:
            mid = (lo + hi) // 2
            if zeros(mid) < k:
                lo = mid + 1
            else:
                hi = mid
        return 5 if zeros(lo) == k else 0
```
