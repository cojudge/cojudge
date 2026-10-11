An undirected graph has `n` original nodes numbered `0` to `n - 1`. Each entry `edges[i] = [u, v, cnt]` means the direct link between `u` and `v` is split by `cnt` brand-new middle nodes in a row, so traveling from `u` to `v` costs `cnt + 1` moves.

Starting from node `0` with at most `maxMoves` moves, you may walk along these chains in any way. Count every node you can reach: original nodes plus any subdivision nodes stepped on. Return that total.

**Constraints:**
- `0 <= edges.length <= 10^4`
- `edges[i] = [u, v, cnt]` with `0 <= u, v < n` and `u != v`
- `0 <= cnt <= 10^4`
- `0 <= maxMoves <= 10^9`
- `1 <= n <= 10`
