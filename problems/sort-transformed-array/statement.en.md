You are given a sorted integer array `nums` plus three coefficients `a`, `b`
and `c`. Apply the quadratic map `f(x) = a*x^2 + b*x + c` to every element,
then return the transformed values in non-decreasing order.

A direct transform breaks the ordering, but the parabola shape lets you refill
the answer from one end: with `a >= 0` the largest values come from the outer
ends, while with `a < 0` the smallest values come from the outer ends.

**Constraints:**
- `1 <= nums.length <= 500`
- `-100 <= nums[i] <= 100`, sorted in non-decreasing order
- `-100 <= a, b, c <= 100`
