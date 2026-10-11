Find the shortest walk that touches every node of an undirected graph.

The graph has `n` nodes labelled `0` to `n-1` and is given by adjacency lists `graph`, where `graph[i]` holds all neighbours of `i`. A walk may start and finish at any nodes and may revisit nodes and edges. Return the smallest possible number of edges in a walk that visits all nodes at least once. The graph is connected.

**Example 1:**
```
Input: graph = [[1,2,3],[0],[0],[0]]
Output: 4
Explanation: Start at node 1, go to 0, then 2, back to 0, then 3: four edges cover all.
```

**Example 2:**
```
Input: graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]
Output: 4
Explanation: A four-edge tour such as 3-2-1-4 plus 1-0 or similar visits everything.
```

**Example 3:**
```
Input: graph = [[]]
Output: 0
Explanation: One node is already fully visited.
```

**Constraints:**
- `1 <= graph.length <= 12`
- `0 <= graph[i].length < graph.length`
- The graph is connected and has no self loops.
