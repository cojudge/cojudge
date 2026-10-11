Given an `m x n` integer matrix and an integer `k`, find the largest sum of
any rectangular submatrix whose sum is no larger than `k`. The test data always
contains at least one such rectangle (a single small-enough cell suffices).

Brute force over all rectangles is too slow for the upper limits. Fixing the
left and right borders collapses each row strip into a 1D array, turning the
inner task into finding the best subarray sum bounded by `k`, which an ordered
set of prefix sums answers in logarithmic time.

**Example 1:**
```
Input: matrix = [[1,0,1],[0,-2,3]], k = 2
Output: 2
Explanation: The single cell holding 2 is the best rectangle at or below k.
```

**Example 2:**
```
Input: matrix = [[2,2,-1]], k = 3
Output: 3
Explanation: The submatrix [[2,-1]] sums to 1 and [[2,2,-1]] sums to 3; the
best value not exceeding 3 is 3.
```

**Constraints:**
- `1 <= m, n <= 20` (judge cases stay small enough for verification)
- `-100 <= matrix[i][j] <= 100`
- `-10^5 <= k <= 10^5`
- At least one rectangle sums to `k` or less.
