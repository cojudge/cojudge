You receive a character grid `board` with `m` rows and `n` columns, together with a list of strings `words`. Collect every entry of `words` that can be traced on the grid by walking from cell to orthogonally touching cell (upward, downward, leftward, or rightward) in letter order, never stepping onto one cell twice while tracing a single entry. Return the subset of entries for which at least one such walk exists.

**Constraints:**

- m == board.length
- n == board[i].length
- 1 ≤ m, n ≤ 12
- board[i][j] is a lowercase English letter.
- 1 ≤ words.length ≤ 3 * 10^4
- 1 ≤ words[i].length ≤ 10
- words[i] consists of lowercase English letters.
- All the strings of words are unique.
