You receive a list `points` where `points[i] = [x_i, y_i]`, plus an integer `k`. Select `k` entries lying nearest to the coordinate origin `(0, 0)` and return them.

Measure nearness by `sqrt(x^2 + y^2)`; because squaring preserves order you may rank by `x^2 + y^2` directly. Result order is unrestricted. When multiple inputs share the boundary distance, returning any sufficient subset of those tied entries is fine.

Each entry of `points` holds precisely two integers.

**Constraints:**

- `1 <= k <= points.length <= 10^4`
- `points[i].length == 2`
- `-10^4 <= x_i, y_i <= 10^4`
