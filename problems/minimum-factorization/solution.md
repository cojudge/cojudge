## Approach

Grab the largest permissible digit factor first (9 down to 2), dividing it out as often as possible; this leaves the fewest digits. A leftover above 1 means a prime factor bigger than 9 survived, so answer 0. Otherwise sort the collected digits increasingly to build the numerically smallest concatenation, guarding against overflow beyond 32-bit signed range.

## Complexity Analysis

- **Time Complexity:** O(log a) divisions plus sorting at most ~30 digits.
- **Space Complexity:** O(log a) for the digit list.

## Implementation

```python
class Solution:
    def smallestFactorization(self, a: int) -> int:
        if a < 10:
            return a
        ds = []
        for d in range(9, 1, -1):
            while a % d == 0:
                ds.append(d)
                a //= d
        if a != 1:
            return 0
        ds.sort()
        res = 0
        for d in ds:
            res = res * 10 + d
        return res if res <= 2 ** 31 - 1 else 0
```
