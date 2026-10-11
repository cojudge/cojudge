## Approach

Precompute the three row sets in lowercase. For each word, lowercase it and pick the reference set from its first letter, then verify every letter belongs to that set. Matching words are collected in input order, preserving original casing.

## Complexity Analysis

- **Time Complexity:** O(total letters) across all words.
- **Space Complexity:** O(1) besides the output.

## Implementation

```python
from typing import List

class Solution:
    def findWords(self, words: List[str]) -> List[str]:
        r1 = set("qwertyuiop")
        r2 = set("asdfghjkl")
        r3 = set("zxcvbnm")
        ans: List[str] = []
        for w in words:
            low = w.lower()
            if not low:
                continue
            f = low[0]
            ref = r1 if f in r1 else (r2 if f in r2 else r3)
            if all(c in ref for c in low):
                ans.append(w)
        return ans
```
