An undirected graph began as a tree with nodes labeled from `1` to `n`. One
additional edge was then added between two different nodes, and that edge did
not already exist in the tree.

Given the resulting edge list, return an edge that can be removed so that the
graph is a tree again. If more than one edge on the cycle could be removed,
return the one that appears last in the input.

**Constraints:**

- `3 <= edges.length <= 1000`
- `edges[i].length == 2`
- `1 <= edges[i][0] < edges[i][1] <= edges.length`
- The graph is connected and consists of a tree plus one additional edge.
- There are no duplicate undirected edges or self-loops.
