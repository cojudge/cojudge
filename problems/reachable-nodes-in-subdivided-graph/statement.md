An undirected graph has `n` original nodes numbered `0` to `n - 1`. Each entry `edges[i] = [u, v, cnt]` means the direct link between `u` and `v` is split by `cnt` brand-new middle nodes in a row, so traveling from `u` to `v` costs `cnt + 1` moves.

Starting from node `0` with at most `maxMoves` moves, you may walk along these chains in any way. Count every node you can reach: original nodes plus any subdivision nodes stepped on. Return that total.

**Example 1:**
```
Input: edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves = 6, n = 3
Output: 13
Explanation: All 3 original nodes are within reach. The three links contribute 7, 1 and 2 reachable middle nodes, for 3 + 7 + 1 + 2 = 13.
```

**Example 2:**
```
Input: edges = [[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves = 10, n = 4
Output: 23
Explanation: All 4 original nodes are within reach, and the four links contribute 4, 6, 8 and 1 middle nodes, for 4 + 4 + 6 + 8 + 1 = 23.
```

**Example 3:**
```
Input: edges = [[1,2,4],[1,4,5],[1,3,1],[2,3,4],[3,4,5]], maxMoves = 17, n = 5
Output: 1
Explanation: Node 0 is isolated, so with no way to leave it only node 0 itself is reachable.
```

**Constraints:**
- `0 <= edges.length <= 10^4`
- `edges[i] = [u, v, cnt]` with `0 <= u, v < n` and `u != v`
- `0 <= cnt <= 10^4`
- `0 <= maxMoves <= 10^9`
- `1 <= n <= 10`
