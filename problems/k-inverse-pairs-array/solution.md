## Approach

Build permutations incrementally: inserting the new largest value into a permutation of size i-1 can create between 0 and i-1 fresh inversions depending on the slot. Summing the compatible previous counts yields the recurrence, and a sliding window over prefix sums evaluates each row in O(k). All arithmetic is reduced modulo 1e9+7.

## Complexity Analysis

- **Time Complexity:** O(n*k) with the window optimization.
- **Space Complexity:** O(k) using two rolling rows.

## Implementation

```python
class Solution:
    def kInversePairs(self, n: int, k: int) -> int:
        MOD = 10 ** 9 + 7
        dp = [0] * (k + 1)
        dp[0] = 1
        for i in range(1, n + 1):
            ndp = [0] * (k + 1)
            window = 0
            for j in range(k + 1):
                window = (window + dp[j]) % MOD
                if j >= i:
                    window = (window - dp[j - i]) % MOD
                ndp[j] = window
            dp = ndp
        return dp[k]
```
