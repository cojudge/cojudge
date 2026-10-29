You receive an integer array `arr` already ordered from smallest to largest, plus two integers `k` and `x`. Select the `k` entries of `arr` that lie nearest to `x`, and return them likewise ordered from smallest to largest.

Closeness is judged as follows: a value `a` ranks ahead of a value `b` when

- `|a - x| < |b - x|`, or
- `|a - x| == |b - x|` and `a < b`.

**Constraints:**

- `1 <= k <= arr.length`
- `1 <= arr.length <= 10^4`
- `arr` is ordered in ascending order.
- `-10^4 <= arr[i], x <= 10^4`
