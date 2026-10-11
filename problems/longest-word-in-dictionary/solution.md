## Approach

Load all words into a set for O(1) prefix checks. Order candidates by decreasing length with alphabetical tie-breaks, then return the first word whose every prefix (including itself) is in the set. If none qualifies, return the empty string.

## Complexity Analysis

- **Time Complexity:** O(N * L^2), where N is the word count and L the max length (substring checks).
- **Space Complexity:** O(N * L) for the set.

## Implementation

```python
from typing import List
class Solution:
    def longestWord(self, words: List[str]) -> str:
        s = set(words)
        words = sorted(words, key=lambda w: (-len(w), w))
        for w in words:
            if all(w[:i] in s for i in range(1, len(w) + 1)):
                return w
        return ""
```
