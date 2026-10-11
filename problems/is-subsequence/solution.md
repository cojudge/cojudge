## Approach

Use two pointers: scan `t` from left to right and advance through `s` whenever the current characters match. Matching the earliest possible occurrence of each needed letter is always safe, so a single greedy pass decides the answer. If all of `s` is consumed, it is a subsequence.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `t`.
- **Space Complexity:** O(1).

## Implementation

```python
class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i = 0
        for c in t:
            if i < len(s) and s[i] == c:
                i += 1
        return i == len(s)
```
