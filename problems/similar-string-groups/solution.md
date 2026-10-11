## Approach

Two words are directly alike when they are identical or differ in exactly two crossing positions. Build clusters by uniting every directly alike pair with a disjoint-set union, then count distinct roots. A pairwise scan is affordable for the given limits.

## Complexity Analysis

- **Time Complexity:** O(n^2 * L), where n is the word count and L the word length, for all pair checks.
- **Space Complexity:** O(n) for the union-find parent array.

## Implementation

```python
from typing import List
class Solution:
    def numSimilarGroups(self, strs: List[str]) -> int:
        n = len(strs)
        parent = list(range(n))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        def similar(a, b):
            d = []
            for i in range(len(a)):
                if a[i] != b[i]:
                    d.append(i)
                    if len(d) > 2:
                        return False
            if len(d) == 0:
                return True
            if len(d) != 2:
                return False
            i, j = d
            return a[i] == b[j] and a[j] == b[i]
        for i in range(n):
            for j in range(i + 1, n):
                if similar(strs[i], strs[j]):
                    a, b = find(i), find(j)
                    if a != b:
                        parent[a] = b
        return len({find(i) for i in range(n)})
```
