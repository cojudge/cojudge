## Approach

Factor every number into distinct primes and union the positions that share a prime, remembering the first index seen per prime. Positions meeting at any prime end up in one set, and the value 1 (with no factors) stays alone. The largest set size is the answer.

## Complexity Analysis

- **Time Complexity:** O(n sqrt(M)) for factoring n numbers up to M, plus near-constant union work.
- **Space Complexity:** O(n + P) for the union arrays and the prime table.

## Implementation

```python
from typing import List
class Solution:
    def largestComponentSize(self, nums: List[int]) -> int:
        n = len(nums)
        parent = list(range(n))
        size = [1] * n

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a, b):
            ra, rb = find(a), find(b)
            if ra == rb:
                return
            if size[ra] < size[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            size[ra] += size[rb]

        def factors(x):
            out = []
            v = x
            p = 2
            while p * p <= v:
                if v % p == 0:
                    out.append(p)
                    while v % p == 0:
                        v //= p
                p += 1
            if v > 1:
                out.append(v)
            return out

        first = {}
        for i, v in enumerate(nums):
            for p in factors(v):
                if p in first:
                    union(i, first[p])
                else:
                    first[p] = i
        return max(size)
```
