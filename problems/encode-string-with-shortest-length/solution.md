## Approach

Build a table where `dp[i][j]` holds the shortest encoding of the slice `s[i..j]`, growing the slices from short to long. For each slice, first try every split point and keep the best concatenation of the two halves, then check whether the whole slice repeats a smaller block: the doubled-string search reveals the shortest period, and the candidate `rep[best-encoding-of-period]` replaces the entry when shorter. Nesting comes for free because periods use their own optimal encodings.

## Complexity Analysis

- **Time Complexity:** O(n^3), from the O(n^2) slices times the split scan.
- **Space Complexity:** O(n^2) for the encoding table.

## Implementation

```python
class Solution:
    def encode(self, s: str) -> str:
        n = len(s)
        dp = [[""] * n for _ in range(n)]
        for ln in range(1, n + 1):
            for i in range(n - ln + 1):
                j = i + ln - 1
                dp[i][j] = s[i:j + 1]
                for k in range(i, j):
                    if len(dp[i][k]) + len(dp[k + 1][j]) < len(dp[i][j]):
                        dp[i][j] = dp[i][k] + dp[k + 1][j]
                sub = s[i:j + 1]
                idx = (sub + sub).find(sub, 1)
                if idx < len(sub):
                    rep = len(sub) // idx
                    cand = f"{rep}[{dp[i][i + idx - 1]}]"
                    if len(cand) < len(dp[i][j]):
                        dp[i][j] = cand
        return dp[0][n - 1]
```
