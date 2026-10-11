## Approach

Track the difference between the two supports. Let `dp[d]` be the tallest height of the higher support reachable with the two supports differing by `d`. Each new rod either joins the taller side (difference grows, height grows), joins the shorter side (difference shrinks or flips, height grows only if the rod overtakes), or is skipped. Copying the table per rod keeps every rod used at most once, and `dp[0]` at the end is the best balanced height.

## Complexity Analysis

- **Time Complexity:** O(n * S), where n is the rod count and S the total length.
- **Space Complexity:** O(S) for the difference table.

## Implementation

```python
class Solution:
    def tallestBillboard(self, rods: list[int]) -> int:
        s = sum(rods)
        NEG = -10 ** 9
        dp = [NEG] * (s + 1)
        dp[0] = 0
        for x in rods:
            nxt = list(dp)
            for d in range(s + 1):
                if dp[d] < 0:
                    continue
                if d + x <= s:
                    nxt[d + x] = max(nxt[d + x], dp[d] + x)
                nd = abs(d - x)
                nxt[nd] = max(nxt[nd], dp[d] + max(0, x - d))
            dp = nxt
        return dp[0]
```
