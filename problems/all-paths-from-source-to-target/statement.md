You receive a directed acyclic graph with `n` vertices numbered `0` through `n - 1`. It is stored as an adjacency list `graph`, where `graph[i]` lists every vertex reachable by one directed edge from `i`. Every edge points from a smaller index to a larger one, so no cycles exist.

List every directed route that starts at vertex `0` and finishes at vertex `n - 1`. The order of the routes in your answer does not matter, but each individual route must list vertices from start to finish.

**Example 1:**
```
Input: graph = [[1,2],[3],[3],[]]
Output: [[0,1,3],[0,2,3]]
Explanation: Two distinct ways cross from 0 to 3.
```

**Example 2:**
```
Input: graph = [[4,3,1],[3,2,4],[3],[4],[]]
Output: [[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]
Explanation: Five routes connect the first vertex to the last one.
```

**Example 3:**
```
Input: graph = [[1],[]]
Output: [[0,1]]
Explanation: The single edge is the only route.
```

**Constraints:**
- `2 <= n <= 15`
- `graph[i]` contains distinct vertices larger than `i`
- At least the structure is acyclic; the target may be unreachable
- Adaptation: the nested input maps to int_array_2d and the nested output maps to int_list_2d in this judge.
