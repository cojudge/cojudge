Start from a tree whose vertices carry the labels `1` through `n`. A single
extra link is then inserted joining two distinct vertices that were not
already joined directly.

From the resulting edge listing, pick out one edge whose deletion turns the
graph back into a tree. When the cycle offers several deletable candidates,
hand back the candidate listed last in the input.

**Constraints:**

- `3 <= edges.length <= 1000`
- `edges[i].length == 2`
- `1 <= edges[i][0] < edges[i][1] <= edges.length`
- The graph is connected and consists of a tree plus one additional edge.
- There are no duplicate undirected edges or self-loops.
