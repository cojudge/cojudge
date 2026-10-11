## Approach

Deduplicate the words, then discard any word that is a proper suffix of another word: those never need their own block because the longer block already covers them. What remains are mutually non-suffix words, each requiring its own `word + "#"` segment, so the answer is the sum of their lengths plus one hash each.

## Complexity Analysis

- **Time Complexity:** O(total characters squared in the worst case) for suffix deletions; tiny given the limits.
- **Space Complexity:** O(total characters) for the set.

## Implementation

```python
from typing import List
class Solution:
    def minimumLengthEncoding(self, words: List[str]) -> int:
        keep = set(words)
        for w in words:
            for i in range(1, len(w)):
                keep.discard(w[i:])
        return sum(len(w) + 1 for w in keep)
```
