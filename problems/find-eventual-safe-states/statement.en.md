You receive a directed graph as an adjacency list `graph`, where `graph[i]` lists the neighbours reached by outgoing edges from node `i`. A node is called safe when every directed walk starting there must eventually arrive at a terminal node (one with no outgoing edges) and therefore can never loop forever.

Return all safe nodes in increasing numerical order.

**Constraints:**
- `1 <= graph.length <= 10^4`
- `0 <= graph[i].length <= graph.length`
- Values in `graph[i]` are distinct and lie in range
- Adaptation: the nested input maps to int_array_2d and the flat output maps to int_list in this judge.
