## Approach

A longer block of ones implies a smaller base, so examine possible exponents from large to small. For a fixed exponent `m` (meaning `m+1` ones), the geometric sum grows monotonically in the base, which allows binary search between 2 and roughly `n^(1/m)`. Summation stops early as soon as the partial total passes `n`, keeping arithmetic inside 64 bits. The first base found while scanning exponents downward is the smallest good base; the fallback `n-1` (form `11`) always works.

## Complexity Analysis

- **Time Complexity:** O(log^2 n) — up to 60 exponents times a logarithmic binary search.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def smallestGoodBase(self, n: str) -> str:
        N = int(n)
        max_m = N.bit_length() - 1
        for m in range(max_m, 0, -1):
            lo, hi = 2, int(round(N ** (1.0 / m))) + 1
            hi = max(hi, 2)
            hi = min(hi, N - 1)
            while lo <= hi:
                mid = (lo + hi) // 2
                s = 1
                cur = 1
                overflow = False
                for _ in range(m):
                    if cur > N // mid:
                        overflow = True
                        break
                    cur *= mid
                    s += cur
                    if s > N:
                        overflow = True
                        break
                if not overflow and s == N:
                    return str(mid)
                if overflow or s > N:
                    hi = mid - 1
                else:
                    lo = mid + 1
        return str(N - 1)
```
