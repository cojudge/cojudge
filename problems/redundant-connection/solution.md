## Approach

Process the edges in input order with a disjoint-set union structure. If an edge's endpoints already have the same representative, that edge closes the cycle and is the last cycle edge encountered in the input, so it is the required answer. Path compression and union by size keep component operations efficient.

## Complexity Analysis

- **Time Complexity:** O(E alpha(V)), where `alpha` is the inverse Ackermann function.
- **Space Complexity:** O(V) for the disjoint-set arrays.

## Implementation

```python
from typing import List


class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        parent = list(range(len(edges) + 1))
        size = [1] * (len(edges) + 1)

        def find(node: int) -> int:
            while node != parent[node]:
                parent[node] = parent[parent[node]]
                node = parent[node]
            return node

        for first, second in edges:
            root_a = find(first)
            root_b = find(second)
            if root_a == root_b:
                return [first, second]
            if size[root_a] < size[root_b]:
                root_a, root_b = root_b, root_a
            parent[root_b] = root_a
            size[root_a] += size[root_b]

        return []
```
