## Approach

Sweep through `s` while tracking the length of the current alphabet-consecutive run (where each character follows the previous one, wrapping from `z` to `a`). For every position, all run suffixes ending there are valid wraparound substrings, but to avoid double counting keep, per letter, only the longest run ever seen ending with it: a run of length `L` ending in some letter contributes exactly `L` distinct substrings for that letter. Summing the 26 best values gives the answer.

## Complexity Analysis

- **Time Complexity:** O(n), one pass over the string.
- **Space Complexity:** O(1), just the 26 counters.

## Implementation

```python
class Solution:
    def findSubstringInWraproundString(self, s: str) -> int:
        best = [0] * 26
        run = 0
        for i, ch in enumerate(s):
            if i > 0 and (ord(ch) - ord(s[i - 1])) % 26 == 1:
                run += 1
            else:
                run = 1
            c = ord(ch) - ord("a")
            if run > best[c]:
                best[c] = run
        return sum(best)
```
