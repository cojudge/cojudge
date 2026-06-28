## Approach

Use a sliding window with a character counter. Expand the right pointer while decrementing needed counts; when all characters are matched, shrink the left pointer while tracking the minimal valid window.

## Complexity Analysis

- **Time Complexity:** O(n)
- **Space Complexity:** O(k) where k is the character set size

## Implementation

```python
from collections import Counter
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        missing = len(t)
        l = 0
        res = ''
        for r, c in enumerate(s):
            if need[c] > 0:
                missing -= 1
            need[c] -= 1
            while missing == 0:
                if not res or r - l + 1 < len(res):
                    res = s[l:r+1]
                need[s[l]] += 1
                if need[s[l]] > 0:
                    missing += 1
                l += 1
        return res
```
