## Approach

Track prefix counts where each new character extends prior decodings by one letter, or joins the previous character as a pair. Stars multiply the transitions: 9 solo options, and pair counts of 9 after '1', 6 after '2', or 15 for two stars (9 for 11-19 plus 6 for 21-26). All sums use the required modulus, and zero-led chunks contribute nothing.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`.
- **Space Complexity:** O(n) for the prefix table (easily reducible to O(1)).

## Implementation

```python
class Solution:
    def numDecodings(self, s: str) -> int:
        MOD = 1000000007
        def single(c):
            if c == "*":
                return 9
            return 0 if c == "0" else 1
        def pair(a, b):
            if a == "0":
                return 0
            if a == "1":
                return 9 if b == "*" else 1
            if a == "2":
                if b == "*":
                    return 6
                return 1 if b <= "6" else 0
            if a == "*":
                if b == "*":
                    return 15
                return 2 if b <= "6" else 1
            return 0
        n = len(s)
        dp = [0] * (n + 1)
        dp[0] = 1
        dp[1] = single(s[0])
        for i in range(2, n + 1):
            dp[i] = (dp[i-1] * single(s[i-1]) + dp[i-2] * pair(s[i-2], s[i-1])) % MOD
        return dp[n]
```
