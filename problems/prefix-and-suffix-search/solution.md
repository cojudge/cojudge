## Approach

Iterate the dictionary from the last index toward the first and test each word with a prefix check and a suffix check. The first word passing both is the largest valid index, so return it at once. If the loop ends, no word fits and the answer is -1.

## Complexity Analysis

- **Time Complexity:** O(m * L), where m is the number of words and L is the average word length for the two checks.
- **Space Complexity:** O(1) besides the inputs.

## Implementation

```python
from typing import List
class Solution:
    def wordFilter(self, words: List[str], pref: str, suff: str) -> int:
        for i in range(len(words) - 1, -1, -1):
            if words[i].startswith(pref) and words[i].endswith(suff):
                return i
        return -1
```
