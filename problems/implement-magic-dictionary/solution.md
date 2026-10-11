## Approach

Keep the current dictionary as a list. A packed build entry is split on '|' to refresh it. Each search scans stored words of equal length and counts differing positions, stopping early after two mismatches; exactly one mismatch means success.

## Complexity Analysis

- **Time Complexity:** O(D * L) per search, where D is dictionary size and L word length.
- **Space Complexity:** O(D * L) to store the dictionary.

## Implementation

```python
from typing import List
class Solution:
    def runMagicDictionary(self, operations: List[str], words: List[str]) -> List[int]:
        d = []
        ans = []
        for op, w in zip(operations, words):
            if op == "buildDict":
                d = [x for x in w.split("|") if x] if w else []
            else:
                ok = False
                for cand in d:
                    if len(cand) != len(w):
                        continue
                    diff = sum(1 for a, b in zip(cand, w) if a != b)
                    if diff == 1:
                        ok = True
                        break
                ans.append(1 if ok else 0)
        return ans
```
