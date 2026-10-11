Picture a board with 2 rows and `n` columns. You own two kinds of tiles
that may be turned around:

- a straight domino covering a `2 x 1` (or `1 x 2`) strip,
- an L-shaped tromino covering three cells of a `2 x 2` square.

Cover the whole board exactly, without gaps or overlaps. Two coverings
count as different when some pair of side-touching cells is joined inside
one tile in one covering but split across two tiles in the other.

Given `n`, count all valid coverings. The total can be huge, so report it
modulo `1_000_000_007`.

**Example 1:**
```
Input: n = 3
Output: 5
Explanation: Five distinct tilings fill a 2x3 board with dominoes and
trominoes.
```

**Example 2:**
```
Input: n = 1
Output: 1
Explanation: Only a single vertical domino fits.
```

**Example 3:**
```
Input: n = 2
Output: 2
Explanation: Either two vertical dominoes or two horizontal ones.
```

**Constraints:**
- `1 <= n <= 1000`
