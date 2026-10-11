## Approach

Convert every word into a 26-bit mask recording which letters occur in it. Two words share no letter exactly when the bitwise AND of their masks is zero. Checking all pairs of masks and keeping the greatest length product yields the answer.

## Complexity Analysis

- **Time Complexity:** O(n^2 + L), where n is the number of words and L is their total length for building masks.
- **Space Complexity:** O(n) for the masks.

## Implementation

```python
from typing import List
class Solution:
    def maxProduct(self, words: List[str]) -> int:
        masks = []
        for w in words:
            m = 0
            for c in w:
                m |= 1 << (ord(c) - ord('a'))
            masks.append(m)
        best = 0
        for i in range(len(words)):
            for j in range(i + 1, len(words)):
                if masks[i] & masks[j] == 0:
                    best = max(best, len(words[i]) * len(words[j]))
        return best
```
