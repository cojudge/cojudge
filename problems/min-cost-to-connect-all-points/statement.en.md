You are given points in the plane, where `points[i] = [xi, yi]`. The cost of
connecting two points is their Manhattan distance:
`|xi - xj| + |yi - yj|`.

Return the minimum total cost needed to connect every point so that there is
exactly one path between every pair of points.

**Constraints:**

- `1 <= points.length <= 1000`
- `points[i].length == 2`
- `-10^6 <= xi, yi <= 10^6`
- All points are distinct.
- The answer fits in a 32-bit signed integer.
