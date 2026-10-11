## Approach

The count of magical numbers up to `x` follows from inclusion-exclusion: multiples of `a` plus multiples of `b` minus multiples of their least common multiple. That count grows monotonically, so binary search finds the smallest `x` with a count of at least `n`. All search arithmetic uses 64-bit integers, and the modulo `10^9 + 7` is applied once to the final answer.

## Complexity Analysis

- **Time Complexity:** O(log(n * min(a, b))) for the binary search, with O(log(min(a, b))) extra for the gcd.
- **Space Complexity:** O(1).

## Implementation

```python
import math

class Solution:
    def nthMagicalNumber(self, n: int, a: int, b: int) -> int:
        MOD = 1000000007
        l = a // math.gcd(a, b) * b
        lo, hi = 1, n * min(a, b)
        while lo < hi:
            mid = (lo + hi) // 2
            if mid // a + mid // b - mid // l >= n:
                hi = mid
            else:
                lo = mid + 1
        return lo % MOD
```
