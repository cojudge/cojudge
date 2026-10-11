## Approach

Instead of asking how many drops a tower needs, ask how tall a tower `m` drops can resolve: one more drop lets you test a floor, then handle the `dp[m-1][e-1]` floors below it if the egg breaks or the `dp[m-1][e]` floors above it if it survives, giving `dp[m][e] = dp[m-1][e-1] + dp[m-1][e] + 1`. Increase `m` until the coverage reaches `n`, keeping a single array swept from high egg counts downward.

## Complexity Analysis

- **Time Complexity:** O(k * m), where m is the answer (at most n). Each round updates k entries.
- **Space Complexity:** O(k) for the coverage array.

## Implementation

```python
class Solution:
    def superEggDrop(self, k: int, n: int) -> int:
        dp = [0] * (k + 1)
        moves = 0
        while dp[k] < n:
            moves += 1
            for e in range(k, 0, -1):
                dp[e] = dp[e] + dp[e - 1] + 1
        return moves
```
