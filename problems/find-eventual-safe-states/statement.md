You receive a directed graph as an adjacency list `graph`, where `graph[i]` lists the neighbours reached by outgoing edges from node `i`. A node is called safe when every directed walk starting there must eventually arrive at a terminal node (one with no outgoing edges) and therefore can never loop forever.

Return all safe nodes in increasing numerical order.

**Example 1:**
```
Input: graph = [[1,2],[2,3],[5],[0],[5],[],[]]
Output: [2,4,5,6]
Explanation: Nodes 2, 4, 5, and 6 only lead to terminals, while the rest can reach a cycle.
```

**Example 2:**
```
Input: graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]
Output: [4]
Explanation: Only the terminal node 4 is safe.
```

**Example 3:**
```
Input: graph = [[],[0,2,3],[3],[4],[]]
Output: [0,1,2,3,4]
Explanation: The graph has no directed cycle, so every node is safe.
```

**Constraints:**
- `1 <= graph.length <= 10^4`
- `0 <= graph[i].length <= graph.length`
- Values in `graph[i]` are distinct and lie in range
- Adaptation: the nested input maps to int_array_2d and the flat output maps to int_list in this judge.
