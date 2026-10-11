## Approach

Slide a window of width 10 over the string and count each block with a hash set. Keep a `seen` set for blocks observed once and a `repeated` set for blocks observed at least twice. Adding to `repeated` on the second sighting guarantees every qualifying fragment is reported exactly once.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the length of `s`. Each window is hashed once.
- **Space Complexity:** O(n) for the stored substrings in the worst case.

## Implementation

```python
from typing import List

class Solution:
    def findRepeatedDnaSequences(self, s: str) -> List[str]:
        seen = set()
        repeated = set()
        for i in range(len(s) - 9):
            sub = s[i:i + 10]
            if sub in seen:
                repeated.add(sub)
            else:
                seen.add(sub)
        return sorted(repeated)
```
