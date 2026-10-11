## Approach

Normalise each string to the larger of itself and its reversal, since non-cut strings always prefer the larger orientation. Then treat each position i as the cut holder: join the remaining normalised strings as the middle, and try every rotation of strs[i] in both forward and reversed forms, keeping the lexicographic best.

## Complexity Analysis

- **Time Complexity:** O(L^2) where L is total characters.
- **Space Complexity:** O(L) for candidate strings.

## Implementation

```python
from typing import List
class Solution:
    def splitLoopedString(self, strs: List[str]) -> str:
        strs = [s[::-1] if s[::-1] > s else s for s in strs]
        ans = "".join(strs)
        for i, s in enumerate(strs):
            t = "".join(strs[i + 1:]) + "".join(strs[:i])
            for j in range(len(s)):
                a, b = s[j:], s[:j]
                ans = max(ans, a + t + b)
                ans = max(ans, b[::-1] + t + a[::-1])
        return ans
```
