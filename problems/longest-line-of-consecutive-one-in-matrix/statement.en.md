Given a binary matrix `mat` of `0`s and `1`s, find the length of the longest run of consecutive `1`s. Runs may extend horizontally, vertically, diagonally (top-left to bottom-right), or anti-diagonally (top-right to bottom-left).

Every cell holding a `1` starts runs of length 1 in each direction; longer runs build by extending a neighboring run that points the same way. An all-zero matrix scores 0.

**Constraints:**
- `1 <= mat.length, mat[i].length <= 10^4`, with at most `10^4` cells total.
- Each entry is `0` or `1`.
