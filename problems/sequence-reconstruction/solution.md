## Approach

Build a directed graph from adjacent pairs inside every sequence, counting incoming edges per value. Then run a topological walk starting from zero-indegree values. If more than one value is ever ready, the order is not unique. If the walk emits values in a different order than `nums`, or some value never appeared in the input, the answer is false. Otherwise the reconstruction matches uniquely.

## Complexity Analysis

- **Time Complexity:** O(V + E), where V is `n` and E is the total number of adjacent pairs across `sequences`.
- **Space Complexity:** O(V + E) for the graph and indegree table.

## Implementation

```python
from typing import List
from collections import defaultdict, deque
class Solution:
    def sequenceReconstruction(self, nums: List[int], sequences: List[List[int]]) -> bool:
        n = len(nums)
        graph = defaultdict(set)
        indeg = defaultdict(int)
        for x in nums:
            indeg[x] = 0
        seen = set()
        for seq in sequences:
            for i, v in enumerate(seq):
                if v < 1 or v > n:
                    return False
                seen.add(v)
                if i > 0:
                    u = seq[i - 1]
                    if u < 1 or u > n:
                        return False
                    if v not in graph[u]:
                        graph[u].add(v)
                        indeg[v] += 1
        for x in nums:
            if x not in seen:
                return False
        q = deque([x for x in nums if indeg[x] == 0])
        idx = 0
        while q:
            if len(q) > 1:
                return False
            u = q.popleft()
            if idx >= n or nums[idx] != u:
                return False
            idx += 1
            for v in graph.get(u, []):
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return idx == n
```
