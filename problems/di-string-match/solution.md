## Approach

Maintain the smallest and largest numbers not used yet. Scanning the pattern left to right, place the current minimum on an `I` (leaving room above for the rise) and the current maximum on a `D` (leaving room below for the fall). After the scan one number remains and it completes the permutation.

## Complexity Analysis

- **Time Complexity:** O(n), a single pass with constant work per character.
- **Space Complexity:** O(n) for the answer array.

## Implementation

```python
from typing import List
class Solution:
    def diStringMatch(self, s: str) -> List[int]:
        lo, hi = 0, len(s)
        ans = []
        for c in s:
            if c == 'I':
                ans.append(lo)
                lo += 1
            else:
                ans.append(hi)
                hi -= 1
        ans.append(lo)
        return ans
```
