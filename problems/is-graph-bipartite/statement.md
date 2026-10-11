An undirected network has `n` vertices numbered `0` through `n-1`. For each
vertex `u`, the list `graph[u]` names all vertices directly linked to `u`
by an edge. The network has no loops, no duplicate edges, and every link is
listed in both directions. It may split into several disconnected pieces.

The network is called two-colorable when every vertex can be painted with
one of two colors so that no edge joins two vertices of the same color.
Equivalently, the vertices split into two groups with all edges crossing
between the groups.

Given the adjacency lists, decide whether the network has this property.

**Example 1:**
```
Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
Output: false
Explanation: The first three vertices are all pairwise linked, forming a
triangle, which cannot be two-colored.
```

**Example 2:**
```
Input: graph = [[1,3],[0,2],[1,3],[0,2]]
Output: true
Explanation: Even-indexed vertices can share one color and odd-indexed
vertices the other; every edge crosses between the two sets.
```

**Example 3:**
```
Input: graph = [[1],[0]]
Output: true
Explanation: A single edge is trivially two-colorable.
```

**Constraints:**
- `graph.length == n`
- `1 <= n <= 100`
- `0 <= graph[u].length < n`
- `0 <= graph[u][i] <= n - 1`
- `graph[u]` holds no `u` itself and no repeats.
- Whenever `v` appears in `graph[u]`, `u` appears in `graph[v]`.
