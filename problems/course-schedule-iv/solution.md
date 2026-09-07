## Approach

Floyd-Warshall reachability on the prerequisite graph, then answer each query in O(1).

## Complexity Analysis

- **Time Complexity:** O(n^3 + q)
- **Space Complexity:** O(n^2)

## Implementation

```python
from typing import List
class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]):
        reach = [[False]*numCourses for _ in range(numCourses)]
        for a, b in prerequisites:
            reach[a][b] = True
        for k in range(numCourses):
            for i in range(numCourses):
                if reach[i][k]:
                    for j in range(numCourses):
                        if reach[k][j]:
                            reach[i][j] = True
        # return list of bool; runner may display as true/false strings via Marker path
        return ["true" if reach[u][v] else "false" for u, v in queries]
```
