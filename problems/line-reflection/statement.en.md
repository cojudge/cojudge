You are given points on a 2D grid. Decide whether some vertical line mirrors
the whole set onto itself: reflecting every point across the line must land on
another point of the set (possibly itself). The mirror line may pass halfway
between integer coordinates.

For instance, `[[1,1],[-1,1]]` is symmetric around the vertical axis, while
`[[1,1],[-1,-1]]` is not, because the mirror of `(1,1)` would be `(-1,1)`,
which is missing.

**Constraints:**
- `0 <= points.length <= 10000`
- `points[i].length == 2`
- `-10^8 <= points[i][j] <= 10^8`
