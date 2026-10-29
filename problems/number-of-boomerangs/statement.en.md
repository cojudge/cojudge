You are given distinct points `points` on a plane, each written as `[x, y]`. A boomerang is an ordered triple `(i, j, k)` of different indices where point `i` sits equally far from `j` and `k`. The order of the two outer points matters, so `(i,j,k)` and `(i,k,j)` count as two boomerangs when both qualify.

Return the total number of boomerangs.

Distances are compared by squared length, so no square roots are needed.

**Constraints:**
- `1 <= points.length <= 500`
- Each point is `[x, y]` with `-10^4 <= x, y <= 10^4`.
- All points are distinct.
