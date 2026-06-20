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

**Example 1:**

```
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: There are 4 nodes in the graph.
1st node (val=1)'s neighbors are 2nd node (val=2) and 4th node (val=4).
2nd node (val=2)'s neighbors are 1st node (val=1) and 3rd node (val=3).
3rd node (val=3)'s neighbors are 2nd node (val=2) and 4th node (val=4).
4th node (val=4)'s neighbors are 1st node (val=1) and 3rd node (val=3).
```

**Example 2:**

```
Input: adjList = [[]]
Output: [[]]
Explanation: The graph contains only one node with val=1 and no neighbors.
```

**Example 3:**

```
Input: adjList = []
Output: []
Explanation: The graph is empty.
```

**Example 4:**

```
Input: adjList = [[2],[1]]
Output: [[2],[1]]
Explanation: Two nodes connected by a single edge.
```

**Constraints:**
- The number of nodes in the graph is in the range `[0, 100]`.
- `1 <= Node.val <= 100`
- `Node.val` is unique for each node.
- There are no repeated edges and no self-loops in the graph.
- The graph is connected and all nodes can be visited starting from the given node.
