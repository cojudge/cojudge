## Approach

Walk through the array once, tracking the most recent index of each target word. Each time both words have been observed, compute the gap between their latest positions and keep the smallest. Because only the nearest occurrences can improve the answer, one pass is enough.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of words. Each word is inspected once.
- **Space Complexity:** O(1), only two indices and the best gap.

## Implementation

```python
from typing import List

class Solution:
    def shortestDistance(self, wordsDict: List[str], word1: str, word2: str) -> int:
        best = len(wordsDict)
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
