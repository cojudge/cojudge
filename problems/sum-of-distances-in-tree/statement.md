You are given an undirected tree with `n` nodes labelled `0` to `n - 1` and an edge list `edges`, where each entry connects two nodes. For every node `i`, compute the sum of the distances (number of edges on the shortest path) from `i` to all other nodes. Return these sums as an array `answer` where `answer[i]` belongs to node `i`.

**Constraints:**
- `1 <= n <= 3 * 10^4`
- `edges.length == n - 1`
- `0 <= edges[i][0], edges[i][1] < n`
- The edges form a valid tree
