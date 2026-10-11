Alice and Bob play another take-away contest on a row of piles, where `piles[i]` gives the stone count of the `i`-th pile, a positive integer. Whoever gathers the most stones by the end wins.

Alice opens and the two alternate moves.

A move always consumes piles from the front of what is left. If `M` is the current limit, the player selects some `X` with `1 <= X <= 2M` and collects the first `X` piles. Afterwards the limit becomes `M = max(M, X)`. The limit starts at `M = 1`.

Removal continues until no pile remains.

Both competitors choose optimally. Return the largest total Alice can finish with.

**Constraints:**
- 1 ≤ piles.length ≤ 100
- 1 ≤ piles[i] ≤ 10<sup>4</sup>
