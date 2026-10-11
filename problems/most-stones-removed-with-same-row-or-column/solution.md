## Approach

View stones as nodes joined when they share a row or a column. Inside one connected group the stones can be cleared down to a single survivor, so a group of size k contributes k - 1 removals. Merging all pairs with a disjoint-set union (quadratic pairing is fast enough for n up to 1000) gives the group count, and the answer is stones minus groups.

## Complexity Analysis

- **Time Complexity:** O(n^2) for checking every pair, with near-constant union cost.
- **Space Complexity:** O(n) for the parent array.

## Implementation

```python
from typing import List
class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        n = len(stones)
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        comps = n
        for i in range(n):
            for j in range(i + 1, n):
                if stones[i][0] == stones[j][0] or stones[i][1] == stones[j][1]:
                    ri, rj = find(i), find(j)
                    if ri != rj:
                        parent[ri] = rj
                        comps -= 1
        return n - comps
```
