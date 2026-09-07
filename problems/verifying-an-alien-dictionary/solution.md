## Approach

Map each letter to its rank in `order`. Compare every pair of adjacent words with that ranking; a shorter prefix must come first when prefixes match.

## Complexity Analysis

- **Time Complexity:** O(total characters)
- **Space Complexity:** O(1)

## Implementation

```python
from typing import List
class Solution:
    def isAlienSorted(self, words: List[str], order: str) -> bool:
        rank = {c: i for i, c in enumerate(order)}
        def le(a, b):
            for x, y in zip(a, b):
                if rank[x] < rank[y]:
                    return True
                if rank[x] > rank[y]:
                    return False
            return len(a) <= len(b)
        return all(le(words[i], words[i+1]) for i in range(len(words)-1))
```
