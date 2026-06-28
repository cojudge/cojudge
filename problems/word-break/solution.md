## Approach

Use dynamic programming where dp[i] indicates whether the prefix s[:i] can be segmented into dictionary words. For each position, check all substrings ending at i against the word set.

## Complexity Analysis

- **Time Complexity:** O(n²)
- **Space Complexity:** O(n)

## Implementation

```python
from typing import List
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        words = set(wordDict)
        max_len = max(len(w) for w in wordDict) if wordDict else 0
        dp = [False] * (len(s) + 1)
        dp[0] = True
        for i in range(1, len(s) + 1):
            for j in range(max(0, i - max_len), i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break
        return dp[len(s)]
```
