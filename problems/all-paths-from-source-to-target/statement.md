You receive a directed acyclic graph with `n` vertices numbered `0` through `n - 1`. It is stored as an adjacency list `graph`, where `graph[i]` lists every vertex reachable by one directed edge from `i`. Every edge points from a smaller index to a larger one, so no cycles exist.

List every directed route that starts at vertex `0` and finishes at vertex `n - 1`. The order of the routes in your answer does not matter, but each individual route must list vertices from start to finish.

**Constraints:**
- `2 <= n <= 15`
- `graph[i]` contains distinct vertices larger than `i`
- At least the structure is acyclic; the target may be unreachable
- Adaptation: the nested input maps to int_array_2d and the nested output maps to int_list_2d in this judge.
