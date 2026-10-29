Given an `m x n` integer matrix and an integer `k`, find the largest sum of
any rectangular submatrix whose sum is no larger than `k`. The test data always
contains at least one such rectangle (a single small-enough cell suffices).

Brute force over all rectangles is too slow for the upper limits. Fixing the
left and right borders collapses each row strip into a 1D array, turning the
inner task into finding the best subarray sum bounded by `k`, which an ordered
set of prefix sums answers in logarithmic time.

**Constraints:**
- `1 <= m, n <= 20` (judge cases stay small enough for verification)
- `-100 <= matrix[i][j] <= 100`
- `-10^5 <= k <= 10^5`
- At least one rectangle sums to `k` or less.
