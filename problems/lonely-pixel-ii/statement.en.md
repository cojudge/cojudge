You are given a picture as a grid of `B` (black) and `W` (white) pixels, plus a positive integer `N`. A black pixel at position `(r, c)` is counted when all three of these hold:
1. Row `r` contains exactly `N` black pixels.
2. Column `c` contains exactly `N` black pixels.
3. Every row that has a black pixel in column `c` looks exactly like row `r` (same pattern of black and white cells).

Return the total number of black pixels satisfying all three conditions.

**Constraints:**
- `1 <= picture.length, picture[i].length <= 500`
- The grid is rectangular and holds only `B` and `W`.
- `1 <= N <= picture.length`
