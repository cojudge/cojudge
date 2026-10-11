Picture a board with 2 rows and `n` columns. You own two kinds of tiles
that may be turned around:

- a straight domino covering a `2 x 1` (or `1 x 2`) strip,
- an L-shaped tromino covering three cells of a `2 x 2` square.

Cover the whole board exactly, without gaps or overlaps. Two coverings
count as different when some pair of side-touching cells is joined inside
one tile in one covering but split across two tiles in the other.

Given `n`, count all valid coverings. The total can be huge, so report it
modulo `1_000_000_007`.

**Constraints:**
- `1 <= n <= 1000`
