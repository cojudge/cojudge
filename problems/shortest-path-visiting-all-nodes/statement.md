Find the shortest walk that touches every node of an undirected graph.

The graph has `n` nodes labelled `0` to `n-1` and is given by adjacency lists `graph`, where `graph[i]` holds all neighbours of `i`. A walk may start and finish at any nodes and may revisit nodes and edges. Return the smallest possible number of edges in a walk that visits all nodes at least once. The graph is connected.

**Constraints:**
- `1 <= graph.length <= 12`
- `0 <= graph[i].length < graph.length`
- The graph is connected and has no self loops.
