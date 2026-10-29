A binary matrix with `m` rows and `n` columns starts filled with zeros. Flipping picks a uniformly random cell holding 0, sets it to 1, and reports its coordinates; resetting restores all zeros.

**Adaptation used here.** Randomness cannot be graded by exact comparison, so this version asks for a batch directly: given `m`, `n` and `count`, return `count` distinct valid cell positions `[row, col]` as they would come out of successive flips. The grader accepts any set that is the right size, lies inside the board, and contains no duplicates. When `count` exceeds the board capacity `m * n`, return every cell exactly once (any order).

Given `m`, `n` and `count`, return the list of positions.

**Constraints:**
- `1 <= m, n <= 100`
- `0 <= count <= m * n`
