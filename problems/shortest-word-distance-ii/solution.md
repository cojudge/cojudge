## Approach

Index every word to its sorted list of positions in a single pass over `wordsDict`. Each query then merges the two relevant position lists with a two-pointer walk, always advancing the smaller index and tracking the closest pair. This reuses the index across all queries instead of rescanning the array each time.

## Complexity Analysis

- **Time Complexity:** O(n + q * (a + b)), where n is the list length, q the query count, and a, b the occurrence counts per query.
- **Space Complexity:** O(n) for the position index.

## Implementation

```python
from typing import List

class Solution:
    def runShortestWordDistance(self, wordsDict: List[str], word1s: List[str], word2s: List[str]) -> List[int]:
        pos = {}
        for i, w in enumerate(wordsDict):
            pos.setdefault(w, []).append(i)
        ans = []
        for w1, w2 in zip(word1s, word2s):
            a, b = pos[w1], pos[w2]
            i = j = 0
            best = len(wordsDict)
            while i < len(a) and j < len(b):
                best = min(best, abs(a[i] - b[j]))
                if a[i] < b[j]:
                    i += 1
                else:
                    j += 1
            ans.append(best)
        return ans
```
