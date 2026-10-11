## Approach

Growing from length 1, each copy-plus-pastes block multiplies the current size by some factor m at a cost of m steps (one copy, m-1 pastes). Building n therefore costs the sum of the multiplied factors, which is minimized by splitting n into primes. Factoring n and adding the prime factors with multiplicity gives the optimum.

## Complexity Analysis

- **Time Complexity:** O(sqrt(n)) for trial division.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def minSteps(self, n: int) -> int:
        if n <= 1:
            return 0
        ans, x, d = 0, n, 2
        while d * d <= x:
            while x % d == 0:
                ans += d
                x //= d
            d += 1
        if x > 1:
            ans += x
        return ans
```
