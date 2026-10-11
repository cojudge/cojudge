You are given a strictly increasing list `arr` whose first entry is `1`
and whose remaining entries are primes. Consider every quotient formed by
picking two positions `i < j` and computing `arr[i] / arr[j]`. Sorting all
those quotients from small to large, pick the `k`-th one (counting from 1)
and report it as the pair `[arr[i], arr[j]]`.

Return the numerator and denominator as a two-element integer array. No
floating-point comparison is needed; cross-multiplication decides the order
exactly.

**Constraints:**
- `2 <= arr.length <= 1000`
- `1 <= arr[i] <= 3 * 10^4`
- `arr[0] == 1`
- `arr[i]` is prime for `i > 0`.
- Values are unique and strictly increasing.
- `1 <= k <= arr.length * (arr.length - 1) / 2`
