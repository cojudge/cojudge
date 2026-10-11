You are given a set of 2D points with integer coordinates. Pick any three distinct points as triangle corners and measure the triangle's area.

Return the largest achievable area.

Adaptation note: the original task returns a floating number. Here, return the area as a decimal string (for example `"2.0"` or `"0.5"`). The judge parses your string as a double and accepts it within an absolute tolerance of 1e-9 plus a relative tolerance of 1e-5.

**Constraints:**
- `3 <= points.length <= 50`
- `-50 <= points[i][j] <= 50`
- All points are distinct.
