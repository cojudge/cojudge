You are handed a rectangular arrangement `board` of `m` rows by `n` columns holding single characters, plus a target string `word`. Decide whether `word` can be traced across the arrangement by stepping from cell to orthogonally touching cell — upward, downward, leftward, or rightward — matching its letters in order, without stepping onto any single cell twice within the same trace. Return `true` when such a trace exists, and `false` otherwise.

**Constraints:**

- m == board.length
- n = board[i].length
- 1 ≤ m, n ≤ 6
- 1 ≤ word.length ≤ 15
- board and word consists of only lowercase and uppercase English letters.
