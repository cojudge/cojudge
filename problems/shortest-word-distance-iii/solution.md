## Approach

Handle two cases. If the words differ, sweep once with the latest index of each and take the best gap. If they are equal, keep only the previous matching index and compare it against each new occurrence, which measures the closest pair of distinct positions holding that word.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of words. One pass suffices for either case.
- **Space Complexity:** O(1), a few indices and the best gap.

## Implementation

```python
from typing import List

class Solution:
    def shortestWordDistance(self, wordsDict: List[str], word1: str, word2: str) -> int:
        best = len(wordsDict)
        if word1 == word2:
            prev = -1
            for i, w in enumerate(wordsDict):
                if w == word1:
                    if prev != -1:
                        best = min(best, i - prev)
                    prev = i
        else:
            i1 = i2 = -1
            for i, w in enumerate(wordsDict):
                if w == word1:
                    i1 = i
                if w == word2:
                    i2 = i
                if i1 != -1 and i2 != -1:
                    best = min(best, abs(i1 - i2))
        return best
```
