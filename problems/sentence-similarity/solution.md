## Approach

First reject sentences of different lengths. Then place every listed pair into a hash set twice, once per direction, so lookups treat similarity as symmetric. Finally walk the positions: identical words pass freely, and differing words must appear as a directed key in the set.

## Complexity Analysis

- **Time Complexity:** O(w + p), where w is the sentence length and p the number of pairs.
- **Space Complexity:** O(p) for the set.

## Implementation

```python
from typing import List
class Solution:
    def areSentencesSimilar(self, sentence1: List[str], sentence2: List[str], similarPairs: List[List[str]]) -> bool:
        if len(sentence1) != len(sentence2):
            return False
        sim = set()
        for a, b in similarPairs:
            sim.add((a, b))
            sim.add((b, a))
        for a, b in zip(sentence1, sentence2):
            if a != b and (a, b) not in sim:
                return False
        return True
```
