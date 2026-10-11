## Approach

Walk the sorted list from left to right and return the first entry whose single character exceeds the target character. If the scan finishes without a hit, every entry is at or below the target, so the wrap rule gives the front entry. A binary search for the insertion point works too, but the linear pass is already fast enough for the limits.

## Complexity Analysis

- **Time Complexity:** O(n), where n is the number of letters. Each entry is inspected at most once.
- **Space Complexity:** O(1) besides the input and output.

## Implementation

```python
from typing import List
class Solution:
    def nextGreatestLetter(self, letters: List[str], target: str) -> str:
        for ch in letters:
            if ch > target:
                return ch
        return letters[0]
```
