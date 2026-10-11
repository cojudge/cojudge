## Approach

For each letter, only the strongest demand across all of `words2` matters: a candidate must contain every letter at least that many times. Build this per-letter demand table once, then keep the `words1` entries whose letter counts dominate it everywhere.

## Complexity Analysis

- **Time Complexity:** O(total characters in words1 plus total characters in words2).
- **Space Complexity:** O(1) extra besides the output (two fixed 26-counters).

## Implementation

```python
from typing import List
class Solution:
    def wordSubsets(self, words1: List[str], words2: List[str]) -> List[str]:
        need = [0] * 26
        for w in words2:
            c = [0] * 26
            for ch in w:
                c[ord(ch) - 97] += 1
            for i in range(26):
                if c[i] > need[i]:
                    need[i] = c[i]
        ans = []
        for w in words1:
            c = [0] * 26
            for ch in w:
                c[ord(ch) - 97] += 1
            if all(c[i] >= need[i] for i in range(26)):
                ans.append(w)
        return ans
```
