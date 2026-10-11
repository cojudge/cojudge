## Approach

Count how many times each letter appears in the plate, folding case and skipping non-letters. For every candidate, count its letters the same way and keep it when all 26 counts cover the plate counts. Retain the shortest qualifier, updating only on a strictly shorter word so ties keep the earliest position.

## Complexity Analysis

- **Time Complexity:** O(P + m * L), where P is the plate length, m is the number of words, and L is the average word length.
- **Space Complexity:** O(1); only two fixed 26-counters are used.

## Implementation

```python
from typing import List
class Solution:
    def shortestCompletingWord(self, licensePlate: str, words: List[str]) -> str:
        need = [0] * 26
        for c in licensePlate:
            if c.isalpha():
                need[ord(c.lower()) - 97] += 1
        best = None
        for w in words:
            cnt = [0] * 26
            for c in w:
                cnt[ord(c) - 97] += 1
            if all(cnt[i] >= need[i] for i in range(26)):
                if best is None or len(w) < len(best):
                    best = w
        return best
```
