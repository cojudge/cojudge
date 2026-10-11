A binary picture is given as rows of `'0'` (white) and `'1'` (black) characters holding at
least one black pixel; all black pixels link together through shared sides. You are also
given the coordinates `(x, y)` of one black pixel. Return the area of the smallest
axis-aligned rectangle that covers every black pixel.

**Constraints:**
- `1 <= m, n <= 850`
- `image[x][y] == '1'`.
- The picture contains at least one `'1'`, all linked 4-directionally.
