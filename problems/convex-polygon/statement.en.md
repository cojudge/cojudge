You are given the vertices of a polygon in order (either clockwise or counter-clockwise), where `polygon[i] = [x, y]` is the `i`-th vertex and the last vertex connects back to the first.

A polygon is convex when its boundary always turns the same way: walking along the vertices, every turn is either always left or always right. Joints where three consecutive vertices lie on a straight line are allowed and do not break convexity.

Return `true` if the polygon is convex, and `false` otherwise.

**Constraints:**
- `3 <= polygon.length <= 10^4`
- `-10^4 <= polygon[i][0], polygon[i][1] <= 10^4`
