## Approach

Dynamic programming from the end of the string. Let `dp[i]` be the minimum number of extra characters left over after optimally breaking the suffix `s[i:]`. Either `s[i]` is left unused, costing one extra character plus `dp[i + 1]`, or it begins a dictionary word `w` (so `s[i:i + len(w)] == w`), in which case the cost is `dp[i + len(w)]`. Taking the minimum over all cases fills `dp[0]`, the answer. A dictionary set (or a trie) makes word lookups fast.

## Complexity Analysis

- **Time Complexity:** O(n * D), where n is `s.length` and D is the number of dictionary words — we scan every dictionary word at every index.
- **Space Complexity:** O(n) for the DP table.

## Implementation

```python
from typing import List


class Solution:
    def minExtraChar(self, s: str, dictionary: List[str]) -> int:
        n = len(s)
        words = set(dictionary)
        dp = [n - i for i in range(n + 1)]
        for i in range(n - 1, -1, -1):
            dp[i] = dp[i + 1] + 1
            for word in words:
                if s.startswith(word, i):
                    dp[i] = min(dp[i], dp[i + len(word)])
        return dp[0]
```