Consider a connected, undirected, weighted graph holding `n` vertices labeled `0` through `n - 1`. Its edges arrive as an array `edges`, where `edges[i] = [ai, bi, weighti]` describes a two-way link between `ai` and `bi` carrying weight `weighti`. A minimum spanning tree (MST) is a cycle-free collection of edges that still links every vertex while keeping the summed weight as low as achievable.

Classify the edges of this graph's MSTs into two groups: an MST edge is critical when removing it from the graph forces every spanning tree to become strictly heavier than the optimum; it is pseudo-critical when it is absent from at least one MST yet present in a different MST of the same optimal weight.

Report the original positions of these edges as two lists. Either ordering of the indices is acceptable.

**Example 1:**
```
Input: n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
Output: [[0,1],[2,3,4,5]]
```

**Example 2:**
```
Input: n = 4, edges = [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]
Output: [[],[0,1,2,3]]
```

**Constraints:**
- `2 <= n <= 100`
- `1 <= edges.length <= min(200, n * (n - 1) / 2)`
- `edges[i].length == 3`
- `0 <= ai < bi < n`
- `1 <= weighti <= 1000`
- Every pair `(ai, bi)` appears at most once.
