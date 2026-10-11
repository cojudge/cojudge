## Approach

Create a mask over the text and flag every position covered by any keyword occurrence, advancing the search by one after each hit so overlaps are found. Then walk the text once, opening a bold tag at the start of each maximal run of flagged characters and closing it at the run end, merging overlapping and touching spans automatically.

## Complexity Analysis

- **Time Complexity:** O(W * S * L), where W is the word count, S is the text length, and L is the average word length for matching.
- **Space Complexity:** O(S) for the mask plus the output.

## Implementation

```python
from typing import List
class Solution:
    def boldWords(self, words: List[str], s: str) -> str:
        n = len(s)
        bold = [False] * n
        for w in words:
            start = 0
            while True:
                idx = s.find(w, start)
                if idx < 0:
                    break
                for i in range(idx, idx + len(w)):
                    bold[i] = True
                start = idx + 1
        res = []
        for i, ch in enumerate(s):
            if bold[i] and (i == 0 or not bold[i - 1]):
                res.append('<b>')
            res.append(ch)
            if bold[i] and (i == n - 1 or not bold[i + 1]):
                res.append('</b>')
        return ''.join(res)
```
