An undirected graph is given as adjacency lists `graph`, where `graph[i]` holds the neighbors of node `i`. The mouse starts on node `1`, the cat on node `2`, and node `0` is the hole. Play alternates with the mouse moving first:

- The mouse wins instantly by stepping onto node `0`.
- The cat wins instantly by stepping onto the mouse's node.
- The cat is never allowed to enter node `0`; it must pick another neighbor (every test graph gives the cat a legal move).
- If both sides play on forever with no forced win, the result is a draw.

Return `1` when the mouse can force a win, `2` when the cat can force a win, and `0` for a draw under optimal play.

**Example 1:**
```
Input: graph = [[2,5],[3],[3,4,5],[1,2],[2],[0,2]]
Output: 0
```

**Example 2:**
```
Input: graph = [[1,3],[0],[3],[0,2]]
Output: 1
```

**Example 3:**
```
Input: graph = [[1],[0,2],[1,3],[2]]
Output: 2
```

**Constraints:**
- `4 <= graph.length <= 50`
- Every neighbor list is non-empty and every neighbor index is valid
- Node `0` is reachable and the cat always has a move outside node `0`

Note: the graph is passed as plain nested integer arrays (adjacency lists), which is the supported input encoding for this game.
