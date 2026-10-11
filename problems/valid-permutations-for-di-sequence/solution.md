## Approach

Process the pattern left to right while tracking relative ranks rather than exact values. After handling `i` letters, `dp[j]` records how many partial orders end with rank `j`. An `I` step allows any smaller previous rank, so the new row is a prefix sum of the old row; a `D` step allows any larger-or-equal previous rank, so it is a suffix sum. All operations run modulo `1_000_000_007`, and the final row sums to the total number of full permutations.

## Complexity Analysis

- **Time Complexity:** O(n^2) for n up to 200, one linear sweep per character.
- **Space Complexity:** O(n) with two rolling rows.

## Implementation

```python
class Solution:
    def numPermsDISequence(self, s: str) -> int:
        MOD = 10 ** 9 + 7
        n = len(s)
        dp = [1] * (n + 1)
        for i, ch in enumerate(s):
            ndp = [0] * (n + 1)
            if ch == 'I':
                pre = 0
                for j in range(i + 2):
                    ndp[j] = pre
                    if j <= i:
                        pre = (pre + dp[j]) % MOD
            else:
                suf = 0
                for j in range(i, -1, -1):
                    suf = (suf + dp[j]) % MOD
                    ndp[j] = suf
            dp = ndp
        return sum(dp) % MOD
```
