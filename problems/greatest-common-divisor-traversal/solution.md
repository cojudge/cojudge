## Approach

Union-find on indices. For each number, factorize and union with the first index that shared each prime factor. If any value is 1 and n>1, return false.

## Complexity Analysis

- **Time Complexity:** O(n * sqrt(M) + α)
- **Space Complexity:** O(n + M)

## Implementation

```python
from typing import List
class Solution:
    def canTraverseAllPairs(self, nums: List[int]) -> bool:
        n = len(nums)
        if n == 1:
            return True
        if 1 in nums:
            return False
        parent = list(range(n))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        def union(a, b):
            a, b = find(a), find(b)
            if a != b:
                parent[a] = b
        first = {}
        for i, x in enumerate(nums):
            v = x
            p = 2
            while p * p <= v:
                if v % p == 0:
                    if p in first:
                        union(first[p], i)
                    else:
                        first[p] = i
                    while v % p == 0:
                        v //= p
                p += 1
            if v > 1:
                if v in first:
                    union(first[v], i)
                else:
                    first[v] = i
        r = find(0)
        return all(find(i) == r for i in range(n))
```
