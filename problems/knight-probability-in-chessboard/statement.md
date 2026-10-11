On an `n x n` board a knight begins on square `(row, column)` with zero-based coordinates. At every turn the knight picks uniformly among its eight L-shaped jumps (two squares one way and one square sideways), even when a jump would leave the board. The walk ends after exactly `k` jumps, or sooner if the knight steps outside.

Estimate the chance that the knight is still on the board once the walk stops. Report the probability as a decimal string (for example `"0.0625"`).

This is a portable adaptation: CoJudge has no floating type, so inputs stay integers and the output is a decimal string compared with a small tolerance.

**Example 1:**
```
Input: n = 3, k = 2, row = 0, column = 0
Output: "0.0625"
Explanation: From the corner only two of eight first jumps stay inside; the second jump keeps the knight inside with total likelihood 1/16.
```

**Example 2:**
```
Input: n = 1, k = 0, row = 0, column = 0
Output: "1.0"
Explanation: With no jumps requested the knight never leaves.
```

**Example 3:**
```
Input: n = 1, k = 1, row = 0, column = 0
Output: "0.0"
Explanation: Every jump from a lone square exits immediately.
```

**Constraints:**
- `1 <= n <= 25`
- `0 <= k <= 100`
- `0 <= row, column < n`
- Answers are compared with absolute tolerance `1e-9` plus relative tolerance `1e-5`.
