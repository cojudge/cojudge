## Approach

Join the two sentences, split them into words, and tally each word in a frequency map. A second pass keeps exactly those words whose total count equals one. Because the checker compares answers as sets, the kept words may be returned in any order.

## Complexity Analysis

- **Time Complexity:** O(w), where w is the total number of words across both sentences.
- **Space Complexity:** O(w) for the frequency map and the result.

## Implementation

```python
from typing import List

class Solution:
    def uncommonFromSentences(self, s1: str, s2: str) -> List[str]:
        count = {}
        for w in (s1 + " " + s2).split(" "):
            count[w] = count.get(w, 0) + 1
        return [w for w, c in count.items() if c == 1]
```
