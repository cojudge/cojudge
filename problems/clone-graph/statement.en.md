A pointer to one vertex of a **linked undirected** network is supplied.

Produce an independent duplicate (**thorough replica**) of the whole network.

Every vertex stores an integer payload (`int`) together with its adjacency catalogue.

```java
class Node {
    public int val;
    public List<Node> neighbors;
}
```

**Evaluation layout:**

To keep cases compact, vertex payloads coincide with vertex ordinals (1-based).
The supplied `adjList` is a two-dimensional listing in which `adjList[i]` enumerates every neighbour of the `i`-th vertex (1-based).
No `adjList[i]` arrives in any guaranteed ordering.

The routine accepts a pointer to the opening vertex of the network (the `Node` whose `val = 1`).
It must hand back a pointer to the counterpart of that opening vertex inside the duplicated network.

**Constraints:**
- The number of nodes in the graph is in the range `[0, 100]`.
- `1 <= Node.val <= 100`
- `Node.val` is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The graph is connected and all nodes can be visited starting from the given node.
