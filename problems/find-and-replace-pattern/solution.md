## Approach

Encode every string by its repetition shape: scan left to right, numbering each new distinct letter 0, 1, 2, ... in order of first appearance, and record the number sequence. Two strings share the same letter-pattern exactly when their encodings match, so encode the pattern once and keep every word whose encoding equals it.

## Complexity Analysis

- **Time Complexity:** O(W * L), where W is the number of words and L is their maximum length.
- **Space Complexity:** O(L) for the encoding buffers besides the output.

## Implementation

```python
from typing import List

class Solution:
    def findAndReplacePattern(self, words: List[str], pattern: str) -> List[str]:
        def shape(w):
            seen = {}
            code = []
            for c in w:
                if c not in seen:
                    seen[c] = len(seen)
                code.append(seen[c])
            return code

        target = shape(pattern)
        return [w for w in words if shape(w) == target]
```
