## Approach

Track how many ways end on each digit. Start with one way per digit, then repeatedly shift counts along the knight graph: each digit distributes its total to its jump neighbors. After `n-1` transitions, sum all ten totals under the modulus.

## Complexity Analysis

- **Time Complexity:** O(n), with a constant ten-digit transition per step.
- **Space Complexity:** O(1), two arrays of size ten.

## Implementation

```python
class Solution:
    def knightDialer(self, n: int) -> int:
        MOD = 10 ** 9 + 7
        moves = [[4,6],[6,8],[7,9],[4,8],[3,9,0],[],[1,7,0],[2,6],[1,3],[2,4]]
        dp = [1] * 10
        for _ in range(1, n):
            ndp = [0] * 10
            for d in range(10):
                for nb in moves[d]:
                    ndp[nb] = (ndp[nb] + dp[d]) % MOD
            dp = ndp
        return sum(dp) % MOD
```
