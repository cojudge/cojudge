You are given an undirected tree with `n` nodes labelled `0` to `n - 1` and an edge list `edges`, where each entry connects two nodes. For every node `i`, compute the sum of the distances (number of edges on the shortest path) from `i` to all other nodes. Return these sums as an array `answer` where `answer[i]` belongs to node `i`.

**Example 1:**
```
Input: n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]
Output: [8,12,6,10,10,10]
Explanation: Node 2 is central with distances 1,1,1,2,1 totalling 6, while leaf node 1 is far from most nodes with total 12.
```

**Example 2:**
```
Input: n = 1, edges = []
Output: [0]
Explanation: A single node has no distances to sum.
```

**Example 3:**
```
Input: n = 2, edges = [[1,0]]
Output: [1,1]
Explanation: Each node is one edge from the other.
```

**Constraints:**
- `1 <= n <= 3 * 10^4`
- `edges.length == n - 1`
- `0 <= edges[i][0], edges[i][1] < n`
- The edges form a valid tree
