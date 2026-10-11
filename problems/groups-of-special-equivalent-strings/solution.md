## Approach

Even positions never exchange letters with odd positions, so each word is fully described by two multisets: the letters on even spots and the letters on odd spots. Sorting both halves yields a canonical fingerprint; words with identical fingerprints can be morphed into each other and no others can. Counting distinct fingerprints with a set gives the number of families.

## Complexity Analysis

- **Time Complexity:** O(m * k log k) for m words of length k, dominated by sorting the two halves.
- **Space Complexity:** O(m * k) for the stored keys in the worst case.

## Implementation

```python
from typing import List
class Solution:
    def numSpecialEquivGroups(self, words: List[str]) -> int:
        seen = set()
        for w in words:
            even = "".join(sorted(w[0::2]))
            odd = "".join(sorted(w[1::2]))
            seen.add(even + "|" + odd)
        return len(seen)
```
