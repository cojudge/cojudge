Given a sorted integer array `arr`, two integers `k` and `x`, return the `k` closest integers to `x` in the array. The result should also be sorted in ascending order.

An integer `a` is closer to `x` than an integer `b` if:

- |a - x| < |b - x|, or
- |a - x| == |b - x| and a < b

**Constraints:**

- 1 ≤ k ≤ arr.length
- 1 ≤ arr.length ≤ 10^4
- arr is sorted in ascending order.
- -10^4 ≤ arr[i], x ≤ 10^4
