Given a reference of a node in a **connected undirected** graph.

Return a **deep copy** (clone) of the graph.

Each node in the graph contains a value (`int`) and a list of its neighbors.

```java
class Node {
    public int val;
    public List<Node> neighbors;
}
```

**Test case format:**

For simplicity, each node's value is the same as the node's index (1-indexed). The given `adjList` is a 2D array where `adjList[i]` is an array of all the neighbors of the `i`-th node (1-indexed). Each `adjList[i]` is not sorted.

Your function receives a reference to the first node of the graph (`Node` with `val = 1`). You must return a reference to the same node in the cloned graph.

**Constraints:**
- The number of nodes in the graph is in the range `[0, 100]`.
- `1 <= Node.val <= 100`
- `Node.val` is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The graph is connected and all nodes can be visited starting from the given node.
