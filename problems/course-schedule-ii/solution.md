## Approach

Treat every prerequisite pair as a directed edge from the prerequisite to the course. Kahn's algorithm repeatedly appends an indegree-zero course to the answer and removes its outgoing edges. If fewer than `numCourses` courses are processed, a cycle prevents a valid ordering.

## Complexity Analysis

- **Time Complexity:** O(V + E), where V is `numCourses` and E is the number of prerequisite pairs.
- **Space Complexity:** O(V + E) for the graph, indegrees, queue, and result.

## Implementation

```python
from collections import deque
from typing import List


class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1

        ready = deque(course for course in range(numCourses) if indegree[course] == 0)
        order = []
        while ready:
            course = ready.popleft()
            order.append(course)
            for next_course in graph[course]:
                indegree[next_course] -= 1
                if indegree[next_course] == 0:
                    ready.append(next_course)

        return order if len(order) == numCourses else []
```
