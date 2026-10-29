A frog sits on stones placed at distinct positions along a river, starting at position `0`. The positions are given in strictly increasing order in `stones`, and the frog wants to finish on the final stone.

The opening hop must cover exactly `1` unit. Suppose the previous hop covered `k` units; the next hop may cover `k - 1`, `k`, or `k + 1` units, and it must land on a stone ahead (jumps are always forward, and a hop of length zero or less is never allowed).

Decide whether the last stone is reachable under these rules.

**Constraints:**
- `2 <= stones.length <= 2000`
- `0 <= stones[i] <= 2^31 - 1`
- `stones[0] == 0`
- Positions are strictly increasing.
