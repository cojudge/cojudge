Given an array of points where `points[i] = [x_i, y_i]` and an integer `k`, return any `k` points closest to the origin `(0, 0)`.

The distance of `[x, y]` from the origin is `sqrt(x^2 + y^2)`. You may compare squared distances instead of computing square roots. The returned points may be in any order. If several points tie at the cutoff distance, any choice of enough tied input points is accepted.

Every row in `points` contains exactly two integers.

**Constraints:**

- `1 <= k <= points.length <= 10^4`
- `points[i].length == 2`
- `-10^4 <= x_i, y_i <= 10^4`
