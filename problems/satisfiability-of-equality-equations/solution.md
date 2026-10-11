## Approach

Equalities are transitive, so they partition the variables into groups that
must share one value. Process every `==` equation with a union-find structure
over the 26 letters, merging the two sides. Afterwards scan every `!=`
equation: when both sides belong to the same group the requirements clash and
the answer is false; if no clash appears the grouping itself yields a valid
assignment.

## Complexity Analysis

- **Time Complexity:** O(n * α(26) + m), where n is the number of `==` equations and m the number of `!=` equations; union-find operations are effectively constant.
- **Space Complexity:** O(1), just the 26-entry parent array.

## Implementation

```python
from typing import List
class Solution:
    def equationsPossible(self, equations: List[str]) -> bool:
        parent = list(range(26))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for e in equations:
            if e[1] == '=':
                parent[find(ord(e[0]) - 97)] = find(ord(e[3]) - 97)
        for e in equations:
            if e[1] == '!' and find(ord(e[0]) - 97) == find(ord(e[3]) - 97):
                return False
        return True
```
