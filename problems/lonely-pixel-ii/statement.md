You are given a picture as a grid of `B` (black) and `W` (white) pixels, plus a positive integer `N`. A black pixel at position `(r, c)` is counted when all three of these hold:
1. Row `r` contains exactly `N` black pixels.
2. Column `c` contains exactly `N` black pixels.
3. Every row that has a black pixel in column `c` looks exactly like row `r` (same pattern of black and white cells).

Return the total number of black pixels satisfying all three conditions.

**Example 1:**
```
Input: picture = [["W","B","W","B","B","W"],["W","B","W","B","B","W"],["W","B","W","B","B","W"],["W","W","B","W","B","W"]], N = 3
Output: 6
Explanation: The three identical top rows each hold 3 black pixels. Columns 1 and 3 (counting from 0) each hold exactly 3 black pixels, all in identical rows, giving 3 times 2 = 6 qualifying pixels.
```

**Example 2:**
```
Input: picture = [["W","B","W"],["B","W","W"]], N = 1
Output: 2
Explanation: Both black pixels sit in rows and columns that each hold exactly one black pixel, and each column's black rows trivially match.
```

**Constraints:**
- `1 <= picture.length, picture[i].length <= 500`
- The grid is rectangular and holds only `B` and `W`.
- `1 <= N <= picture.length`
