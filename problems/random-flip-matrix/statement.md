There is an `m x n` binary grid matrix with all the values set `0` initially. Design an algorithm to randomly pick an index `(i, j)` where `matrix[i][j] == 0` and flips it to `1`. All the indices `(i, j)` where `matrix[i][j] == 0` should be equally likely to be returned.

Implement the `FlipMatrix` class:

- `FlipMatrix(int m, int n)` Initializes the object with the size of the binary matrix `m` and `n`.
- `int[] flip()` Returns a random index `[i, j]` of the matrix where `matrix[i][j] == 0` and flips it to `1`.
- `void reset()` Resets all the values of the matrix to be `0`.

The class is named `FlipMatrix` here instead of LeetCode's `Solution` because the judge harness reserves `Solution` for its driver; the constructor and methods match the original.

Grading: each `flip` must return an in-bounds cell that has not been flipped since construction or the last `reset`. Any valid trace is accepted — uniformity is not statistically tested (LeetCode likewise allows at most 1000 calls, too few for a distribution test).

**Constraints:**
- `1 <= m, n <= 10^4`
- There will be at least one free cell for each call to `flip`.
- At most `1000` calls will be made to `flip` and `reset`.
